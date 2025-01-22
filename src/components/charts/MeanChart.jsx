import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartDataLabels, Title, Tooltip, Legend);

const calculateStadistics = (data,numberQuestions) => {
    Object.entries(data).map(entry => {
        const sumPopulation = entry[1].population.reduce((p, c) => p + c, 0);
        entry[1].mean = sumPopulation/entry[1].populationSize;

        if (entry[1].populationSize > 2){
            const variance = entry[1].population.map(x => Math.pow(x - entry[1].mean, 2)).reduce((p, c) => p + c) / (entry[1].populationSize - 1);
            entry[1].standarDesviation = Math.sqrt(variance);
        }
    });

    return data;
};

const attemptData = (sessions, domain, data) => {
    sessions.forEach(session => {
        const domainType = domain.chapters !== undefined ? 'chapters' : 'questions';
        if (domainType === 'chapters'){
            const id = session.chapter_id;

            data[id].populationSize++;
            data[id].population.push(session.scores.length/domain.chapters.find(chapter => chapter.id === id).questions.length);
        }
        else {
            const attempts = {};

            session.scores.forEach(score => {
                const id = score.question_id;
                if (attempts[id] === undefined){
                    attempts[id] = 0;
                }

                attempts[id]++;
            });

            Object.entries(attempts).map(entry => {
                const id = entry[0];
                
                data[id].populationSize++;
                data[id].population.push(entry[1]);
            });
        }
    });

    return calculateStadistics(data);
}

const timeData = (sessions, domainType, data) => {
    sessions.forEach(session => {
        session.scores.forEach(score => {
            const id = domainType === 'chapters' ? session.chapter_id : score.question_id;

            data[id].populationSize++;
            data[id].population.push(score.seconds);
        });
    });

    return calculateStadistics(data);
}

const calculateData = (sessions, domain, rangeType) => {
    const meanData = {};

    const initData = () => ({
        mean: 0.0,
        standarDesviation: undefined,
        populationSize: 0,
        population: [],
    });

    const domainType = domain.chapters !== undefined ? 'chapters' : 'questions';

    domain[domainType].forEach(x => {
        meanData[x.id] = initData();
    });
 
    rangeType === 'time' ? timeData(sessions, domainType, meanData) : attemptData(sessions, domain, meanData);
    
    return meanData;
};

function MeanChart({  domain, barSessions , lineSessions }){
    const [barData, handleBarData] = useState({});
    const [lineData, handleLineData] = useState({});
    const [xValues, handleXvalues] = useState([]);
    const [xAxisLabel, handleXAxisLabel] = useState('');
    const [rangeType, handleRangeType] = useState('time');
    
    useEffect(() => {
        if (domain != null) {
            const isChapterFiltered = domain.chapters == undefined;

            if (isChapterFiltered) {
                handleXvalues(domain.questions.map((q) => 'P' + q.number));
                handleXAxisLabel('preguntas');
            }
            else {
                handleXvalues(domain.chapters.map((c) => c.name.split(' ')));
                handleXAxisLabel('capitulos');
            }
        }
    }, [domain]);

    useEffect(() => {
        if (barSessions != null && domain != null) {
            handleBarData(calculateData(barSessions, domain, rangeType));
            console.debug(barData);
        }
    }, [barSessions, rangeType]);

    useEffect(() => {
        if (lineSessions != null & domain != null) {
            handleLineData(calculateData(lineSessions, domain, rangeType));
        }
    }, [lineSessions, rangeType]);

    const dataChart = {
        labels: xValues,
        datasets: [
            {
                label: 'mean',
                data: Object.values(barData).map(d => d.mean),
                backgroundColor: 'rgba(241, 245, 0, 0.65)',
                borderColor: 'rgb(154, 156, 0)',
                borderWidth: 2,
                order: 1,
            },
            {
                label: 'mean line',
                data: Object.values(lineData).map(d => d.mean),
                borderColor: 'rgb(73, 1, 190)',
                order: 0,
                type: 'line',
            },
            {
                label: 'standard desviation',
                data: Object.values(barData).map(d => d.standarDesviation),
                hidden: true,
            },
            {
                label: 'total',
                data: Object.values(barData).map(d => d.populationSize),
                hidden: true,
            }
        ]
    };
    const titleOptions = {
            display: true,
            text: (rangeType === 'time' ? 'Tiempo' : 'Intentos') + ' promedio por ' + xAxisLabel,
        }

    const legendOptions = {
        display: false,
    };

    const tooltipOptions = {
        displayColors: false,
        callbacks: {
            title: (context) => {
                let index = context[0].dataIndex;
                let datasets = context[0].chart.data.datasets;

                let totalScore = datasets[3].data[index];

                return 'Total: ' + totalScore;
            },
            label: (context) => {
                let index = context.dataIndex;
                let datasets = context.chart.data.datasets;

                let standarDesviation = datasets[2].data[index];
                
                let text = standarDesviation !== undefined ?  standarDesviation.toFixed(2) : 'Indefinido';
                return '\u03c3: ' + text;
            },
        }
    };

    const dataLabelOptions = {
        font: {
            weight: 'bold',
        },

        display: (context) => {
            let index = context.dataIndex;
            return context.dataset.data[index] > 0 ;
        },
        formatter: (value, context) => {
            return value.toFixed(2);
        }
    };

    const optionsChart = {

        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                grid: {
                    display: false,
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: rangeType === 'time' ? 'Tiempo (S)' : 'N\u00B0 de intentos',
                },
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            },
        },
        plugins: {
            tooltip: tooltipOptions,
            datalabels: dataLabelOptions,
            legend: legendOptions,
            title: titleOptions,
        },
  };

  return (
    <div className='chart-container'>
        <div>
            <label>
                <input
                    type='radio'
                    name='tiempo'
                    value='time'
                    checked={rangeType === 'time'}
                    onChange={e => handleRangeType(e.target.value)}
                />
            tiempo
            </label>
            <label>
                <input
                    type='radio'
                    name='intentos'
                    value='attempts'
                    checked={rangeType === 'attempts'}
                    onChange={e => handleRangeType(e.target.value)}
                />
            intentos
            </label>
        </div>   
        <div>
            <Bar data={dataChart} options={optionsChart} width={400} height={300}/>
        </div>
    </div>
  );
};

export default MeanChart;
