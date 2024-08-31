import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
        }[];
    };
    className?: string;
    verticalBar?: boolean;
    displayLabel?: boolean;
}

const IbisBarChart: React.FC<BarChartProps> = ({ data, className = "", verticalBar = true, displayLabel = true }) => {
    const options = {
        indexAxis: verticalBar ? 'x' as const : 'y' as const,  // This changes the bar chart to horizontal
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                display: displayLabel,
            },
            title: {
                display: false,
                text: 'Horizontal Bar Chart',
            },
        },
    };

    return (
        <>
            <div className={`w-full md:w-1/2 ${className}`}>
                <Bar data={data} options={options} />
            </div>
        </>
    );
};

export default IbisBarChart;
