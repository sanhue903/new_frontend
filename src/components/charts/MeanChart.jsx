import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartDataLabels, Title, Tooltip, Legend);

/**
 * Inicializa la estructura de estadísticas para cada capítulo/pregunta.
 */
const initData = () => ({
    meanCorrect: 0.0,
    meanIncorrect: 0.0,
    standardDeviationCorrect: undefined,
    standardDeviationIncorrect: undefined,
    populationSize: 0,
    populationCorrect: [],
    populationIncorrect: [],
});

/**
 * Calcula la media de un conjunto de valores.
 */
const calculateMean = (values) => {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calcula la desviación estándar de un conjunto de valores.
 */
const calculateStandardDeviation = (values, mean) => {
    if (values.length < 2) return undefined;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
};

/**
 * Procesa los datos de intentos y tiempo por capítulo/pregunta.
 */
const processData = (sessions, domain, rangeType) => {
    const domainType = domain.chapters ? 'chapters' : 'questions';
    const statistics = {};

    domain[domainType].forEach(item => {
        statistics[item.id] = initData();
    });

    sessions.forEach(session => {
        session.scores.forEach(score => {
            const id = domainType === 'chapters' ? session.chapter_id : score.question_id;
            const entry = statistics[id];

            entry.populationSize++;

            if (score.is_correct) {
                if (rangeType === 'time') {
                    entry.populationCorrect.push(score.seconds);
                } else {
                    entry.populationCorrect.push(score.attempt);
                }
            } else {
                if (rangeType === 'time') {
                    entry.populationIncorrect.push(score.seconds);
                } else {
                    entry.populationIncorrect.push(score.attempt);
                }
            }
        });
    });

    return Object.entries(statistics).map(([id, entry]) => ({
        id: parseInt(id),
        meanCorrect: calculateMean(entry.populationCorrect),
        meanIncorrect: calculateMean(entry.populationIncorrect),
        standardDeviationCorrect: calculateStandardDeviation(entry.populationCorrect, entry.meanCorrect),
        standardDeviationIncorrect: calculateStandardDeviation(entry.populationIncorrect, entry.meanIncorrect),
        populationSize: entry.populationSize,
    }));
};

function MeanChart({ domain, barSessions, lineSessions }) {
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [xValues, setXValues] = useState([]);
    const [xAxisLabel, setXAxisLabel] = useState('');
    const [rangeType, setRangeType] = useState('time');

    useEffect(() => {
        if (domain) {
            const isChapterFiltered = domain.chapters === undefined;

            if (isChapterFiltered) {
                setXValues(domain.questions.map((q) => 'P' + q.number));
                setXAxisLabel('preguntas');
            } else {
                setXValues(domain.chapters.map((c) => c.name.split(' ')));
                setXAxisLabel('dimensión');
            }
        }
    }, [domain]);

    useEffect(() => {
        if (barSessions && domain) {
            setBarData(processData(barSessions, domain, rangeType));
        }
    }, [barSessions, rangeType]);

    useEffect(() => {
        if (lineSessions && domain) {
            setLineData(processData(lineSessions, domain, rangeType));
        }
    }, [lineSessions, rangeType]);

    const dataChart = {
        labels: xValues,
        datasets: [
            {
                label: 'Correctas',
                data: barData.map(d => d.meanCorrect),
                backgroundColor: 'rgba(32, 236, 13, 0.65)',
                borderColor: 'rgb(0, 156, 0)',
                borderWidth: 2,
                order: 1,
            },
            {
                label: 'Incorrectas',
                data: barData.map(d => d.meanIncorrect),
                backgroundColor: 'rgba(250, 9, 9, 0.65)',
                borderColor: 'rgb(151, 18, 0)',
                borderWidth: 2,
                order: 1,
            },
            ...(lineData.length > 0 ? [{
                label: 'Promedio general',
                data: lineData.map(d => (d.meanCorrect + d.meanIncorrect) / 2),
                borderColor: 'rgb(73, 1, 190)',
                borderWidth: 1.5,
                order: 0,
                type: 'line',
            }] : [])
        ]
    };
    
    const tooltipOptions = {
        displayColors: false,
        callbacks: {
            title: (context) => {
                // 🔹 Muestra el total solo en las barras
                if (context[0].dataset.type !== 'line') {
                    return `Total: ${barData[context[0].dataIndex]?.populationSize || 0}`;
                }
                else {
                    return ''
                }
            },
            label: (context) => {
                let index = context.dataIndex;
                let value = context.raw;
    
                // 🔹 Solo muestra el tooltip en el gráfico de línea
                if (context.dataset.type === 'line') {
                    return `Promedio General: ${value.toFixed(2)}`;
                }
    
                // 🔹 Tooltip para las barras con desviación estándar
                let stdCorrect = barData[index]?.standardDeviationCorrect;
                let stdIncorrect = barData[index]?.standardDeviationIncorrect;
                return [
                    `σ Correcto: ${stdCorrect ? stdCorrect.toFixed(2) : 'N/A'}`,
                    `σ Incorrecto: ${stdIncorrect ? stdIncorrect.toFixed(2) : 'N/A'}`
                ];
            },
        }
    };

    const dataLabelOptions = {
        font: {
            weight: 'bold',
            size: 11,
        },
        offset: -5,
        color: 'rgb(51, 47, 47)', // Color del texto
        anchor: 'end', // Posiciona los labels en la parte superior
        align: 'top', // Asegura que los números aparezcan arriba de la barra
        display: (context) => {
            let value = context.dataset.data[context.dataIndex];
            return value > 0 && context.dataset.type !== 'line'; // Oculta DataLabels de la línea y los valores en 0
        },
        formatter: (value) => value.toFixed(2),
    };

    const legendOptions = {
        display: true,
        labels: {
            filter: (legendItem, chartData) => {
                // 🔹 Oculta la leyenda de la línea si no hay datos
                if (legendItem.text === 'Línea Promedio' && lineData.length === 0) {
                    return false;
                }
                return true;
            }
        },
        onClick: () => {}, // 🔹 Deshabilita la interacción con la leyenda
        onHover: (event) => event.native.target.style.cursor = 'default' // 🔹 Evita cambio de cursor en la leyenda
    };

    const optionsChart = {
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false,
                }
            },
            y: {
                title: {
                    display: true,
                    text: rangeType === 'time' ? 'Tiempo (segundos)' : 'Nº de intentos',
                },
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: tooltipOptions,
            datalabels: dataLabelOptions,
            legend: legendOptions,
            title: {
                display: true,
                text: (rangeType === 'time' ? 'Tiempo' : 'Intentos') + ' promedio por ' + xAxisLabel,
            },
        },
    };
    
    


    return (
        <div>
            <div className='mean-choices-container'>
                <label>
                    <input
                        type='radio'
                        name='metric'
                        value='time'
                        checked={rangeType === 'time'}
                        onChange={e => setRangeType(e.target.value)}
                    />
                    Tiempo
                </label>
                <label>
                    <input
                        type='radio'
                        name='metric'
                        value='attempts'
                        checked={rangeType === 'attempts'}
                        onChange={e => setRangeType(e.target.value)}
                    />
                    Intentos
                </label>
            </div>   
            <div className='chart-container'>
                <Bar data={dataChart} options={optionsChart} width={400} height={300}/>
            </div>
        </div>
    );
};

export default MeanChart;

