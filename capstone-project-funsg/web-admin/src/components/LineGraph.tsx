import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js/auto";

import dayjs from "dayjs";
import useUserData from "../hooks/useUserData.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LineGraph = () => {
  const { data: users, isLoading, error } = useUserData();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (error) {
    return <div>Error loading data</div>; // Handle error state
  }

  // Aggregate data: Count new users per month
  const months = Array(12).fill(0);
  users?.forEach((user) => {
    const month = dayjs(user.createdAt).month();
    months[month] += 1;
  });

  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: months, // Use the aggregated data
        borderColor: "rgb(75,192,192)",
        backgroundColor: "rgba(126, 176, 213, 0.2)",
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">
        Monthly New User Registrations
      </h2>
      <Line options={options} data={lineChartData} />
      <div className="mt-8">
        <div className="grid grid-cols-4 gap-4">
          {lineChartData.labels.map((month, index) => (
            <div key={index} className="flex justify-start ms-8">
              <span>{month}:</span>{" "}
              <span className="ml-2">{months[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineGraph;
