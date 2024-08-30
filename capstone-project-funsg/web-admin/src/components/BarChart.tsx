import { Bar } from "react-chartjs-2";
import useCategories from "../hooks/useCategory.ts";

const BarChart = () => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (isError) {
    return <div>Error loading data</div>; // Handle error state
  }

  const labels = categories?.map((category) => category.name) || [];
  const data = categories?.map((category) => category.groups.length) || [];

  const colorSet = [
    "#54bebe",
    "#badbdb",
    "#dedad2",
    "#e4bcad",
    "#df979e",
    "#776bcd",
  ];

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Groups",
        data: data,
        backgroundColor: colorSet,
        borderColor: colorSet.map((color) => color), // Keep the border color the same as the background color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar options={options} data={barChartData} />;
};

export default BarChart;
