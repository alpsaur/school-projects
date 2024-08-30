import { PolarArea } from "react-chartjs-2";
import { ChartOptions } from "chart.js/auto";
import useUserData from "../hooks/useUserData.ts";

const PolarAreaChart = () => {
  const { data: users, isLoading, error } = useUserData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  // Aggregate MBTI tendencies
  const aggregatedData = {
    Extraversion: 0,
    Introversion: 0,
    Sensing: 0,
    Intuition: 0,
    Thinking: 0,
    Feeling: 0,
    Judging: 0,
    Perceiving: 0,
  };

  users?.forEach((user) => {
    if (user.ie_Tendancy > 0) {
      aggregatedData.Introversion += 1;
    } else {
      aggregatedData.Extraversion += 1;
    }

    if (user.ns_Tendancy > 0) {
      aggregatedData.Intuition += 1;
    } else {
      aggregatedData.Sensing += 1;
    }

    if (user.tf_Tendancy > 0) {
      aggregatedData.Thinking += 1;
    } else {
      aggregatedData.Feeling += 1;
    }

    if (user.jp_Tendancy > 0) {
      aggregatedData.Judging += 1;
    } else {
      aggregatedData.Perceiving += 1;
    }
  });

  const pieChartData = {
    labels: [
      "Extroversion",
      "Introversion",
      "Sensing",
      "Intuition",
      "Thinking",
      "Feeling",
      "Judging",
      "Perceiving",
    ],
    datasets: [
      {
        data: [
          aggregatedData.Extraversion,
          aggregatedData.Introversion,
          aggregatedData.Sensing,
          aggregatedData.Intuition,
          aggregatedData.Thinking,
          aggregatedData.Feeling,
          aggregatedData.Judging,
          aggregatedData.Perceiving,
        ],
        backgroundColor: [
          "#fd7f6f",
          "#7eb0d5",
          "#b2e061",
          "#bd7ebe",
          "#ffb55a",
          "#ffee65",
          "#beb9db",
          "#fdcce5",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<"polarArea"> = {
    responsive: true,

    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <PolarArea options={options} data={pieChartData} />;
};

export default PolarAreaChart;
