import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, ArcElement, ChartDataLabels, Title, Tooltip, Legend);

const calculateData = (sessions) => {
    const data = {
        total: 0,
        finishedSessions: 0,
    };

    sessions.forEach(session => {
        data.total++;

        if (session.finish_chapter) {
            data.finishedSessions++;
        }
    });
    
    return data;
};

function SessionChart({ sessions }){
    const [data, handleData] = useState({});
    
    useEffect(() => {
        if (sessions != null) {
            handleData(calculateData(sessions));
        }
    }, [sessions]);

    const dataChart = {
        labels: ['terminado', 'no terminado'],
        datasets: [
            {
                label: 'sesiones',
                data: [data.finishedSessions, data.total - data.finishedSessions],
                backgroundColor: [
                    'rgba(32, 236, 13, 0.65)',
                    'rgba(250, 9, 9, 0.65)',
                ],
                borderColor: ['rgb(0, 156, 0)', 'rgb(151, 18, 0)'],
                borderWidth: 2,
                hoverOffset: 4,
            }
        ]
    };
    const titleOptions = {
            display: true,
            text: 'N\u00B0 de sesiones jugadas',
        }

    const tooltipOptions = {
        position: "nearest",
        yAlign: "bottom", // 🔹 Posiciona el tooltip más abajo para evitar que cubra el datalabel
        xAlign: "center",
        caretPadding: 10,
        callbacks: {
            title: (context) => {
                return 'Total: ' + data.total;
            },
            label: (context) => {
                return Math.round((context.raw/data.total)*100) + '%';
            },
        }
    };

    const legendOptions = {
        display: true,
        onClick: () => {}, // 🔹 Deshabilita la interacción con la leyenda
        onHover: (event) => event.native.target.style.cursor = 'default' // 🔹 Evita cambio de cursor en la leyenda
    };

    const dataLabelOptions = {
        font: {
            weight: 'bold',
            size: 12,
        },
        color: 'rgb(39, 36, 36)', 

        display: (context) => {
            let index = context.dataIndex;
            return context.dataset.data[index] > 0 ;
        },
        formatter: (value, context) => {
            return value;
        }
    };

    const plugins = [{
            id: 'doughnutInteriorText',
            beforeDraw: function(chart) {
                var width = chart.chartArea.width,
                height = chart.chartArea.height,
                ctx = chart.ctx;
        
                ctx.restore();
                var fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";
        
                var text = chart.data.datasets[0].data.reduce((partialSum, a) => partialSum + a, 0) || 0,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = (height / 2) + chart.legend.height + chart.titleBlock.height;
        
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }]


    const optionsChart = {
        rotation: -90,
        plugins: {
            tooltip: tooltipOptions,
            datalabels: dataLabelOptions,
            title: titleOptions,
            legend: legendOptions,
            }
    };


  return (
    <div className='chart-container'> 
        <div>
            <Doughnut data={dataChart} options={optionsChart} plugins={plugins} swidth={100} height={100}/>
        </div>
    </div>
  );
};

export default SessionChart;
