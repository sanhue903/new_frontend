import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartDataLabels, Title, Tooltip, Legend);

const calculateData = (sessions, domain, isChapterFiltered) => {
    const newData = {};

    const initData = () => ({
        totalScores: 0,
        correctScores: 0,
    })

    const domainType = isChapterFiltered ? 'questions' : 'chapters'

    domain[domainType].forEach(y => {
        newData[y.id] = initData();
    });

    sessions.forEach(session => {
        session.scores.forEach(score => {
            let id = isChapterFiltered ? score.question_id : session.chapter_id
            
            newData[id].totalScores++;

            if (score.is_correct) {
                newData[id].correctScores++;
            }
        });
    });
    
    return newData;
};

function CorrectPercentajeChart({ sessions, domain }){
    const [data, handleData] = useState({});
    const [yAxis, handleYAxis] = useState([]);
    const [yAxisLabel, handleYAxisLabel] = useState('');
    
    useEffect(() => {
        if (domain != null) {
            const isChapterFiltered = domain.chapters == undefined;

            if (isChapterFiltered) {
                handleYAxis(domain.questions.map((q) => 'P' + q.number));
                handleYAxisLabel('preguntas');
            }
            else {
                handleYAxis(domain.chapters.map((c) => c.name.split(' ')));
                handleYAxisLabel('capitulos');
            }
        }
    }, [domain]);

    useEffect(() => {
        if (sessions != null && domain != null) {
            const isChapterFiltered = domain.chapters == undefined;
            handleData(calculateData(sessions, domain, isChapterFiltered));
        }
    }, [sessions]);

    const dataChart = {
        labels: yAxis,
        datasets: [
            {
                label: 'Correctas',
                data: Object.values(data).map(d => d.correctScores),
                backgroundColor: 'rgba(32, 236, 13, 0.65)',
                borderColor: 'rgb(0, 156, 0)',
                borderWidth: 2,
                borderSkipped: 'middle',
            },
            {
                label: 'Incorrectas',
                data: Object.values(data).map(d => d.totalScores - d.correctScores),
                backgroundColor: 'rgba(250, 9, 9, 0.65)',
                borderColor: 'rgb(151, 18, 0)',
                borderWidth: 2,
                borderSkipped: 'middle',
            }
        ]
    };

    const titleOptions = {
        display: true,
        text: 'N\u00B0 de respuestas por ' + yAxisLabel,
    }

    const tooltipOptions = {
        callbacks: {
            title: (context) => {
                let index = context[0].dataIndex;
                let datasets = context[0].chart.data.datasets;

                let totalScore = datasets[0].data[index] + datasets[1].data[index];

                return 'Total: ' + totalScore;
            },
            label: (context) => {
                let index = context.dataIndex;
                let datasets = context.chart.data.datasets;

                let totalScore = datasets[0].data[index] + datasets[1].data[index];
                let percentaje = (Math.round(100*context.dataset.data[index]/totalScore));

                return percentaje +'%';
            },

        }
    };

    const dataLabelOptions = {
        font: {
            weight: 'bold',
        },

        display: (context) => {
            let index = context.dataIndex;
            return context.dataset.data[index] !== 0 ;
        },
    };

    const optionsChart = {
        indexAxis: 'y',
        scales: {
            x: {
                display: true,
                stacked: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'N\u00B0 de respuestas',
                },
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                stacked: true,
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: tooltipOptions,
            datalabels: dataLabelOptions,
            title: titleOptions,
        },
  };

  return (
    <div className='chart-container'>
      <div>
        <Bar data={dataChart} options={optionsChart} width={400} height={350}/>
      </div>
    </div>
  );
};

export default CorrectPercentajeChart;
