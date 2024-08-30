import { Heading } from "../components/catalystui/heading.tsx";
import LineGraph from "../components/LineGraph.tsx";
import BarChart from "../components/BarChart.tsx";
import PolarAreaChart from "../components/PolarAreaChart.tsx";
import OverviewStats from "../components/OverviewStats.tsx";

const Dashboard = () => {
  return (
    <main className="content space-y-12">
      {" "}
      <Heading>
        <p className="text-4xl mb-8">Overview</p>
      </Heading>
      <div className="mt-4">
        <OverviewStats />
      </div>
      <div className="userCard flex space-x-8 mt-8">
        {" "}
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow flex-1">
          <div className="px-4 py-5 sm:px-6 font-bold text-xl font-medium text-gray-500">
            Users Growth
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-2"></div>
            <LineGraph></LineGraph>
          </div>
        </div>
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow flex-1">
          <div className="px-4 py-5 sm:px-6 font-bold text-xl font-medium text-gray-500">
            Users MBTI Tendency
          </div>
          <div className="px-4 py-5 sm:p-6 ">
            <PolarAreaChart></PolarAreaChart>
          </div>
        </div>
      </div>
      <div className="groupsCard flex space-x-8">
        {" "}
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow flex-1">
          <div className="px-4 py-5 sm:px-6 font-bold text-xl font-medium text-gray-500">
            Number of Groups Per Category
          </div>
          <div className="px-4 py-5 sm:p-6 justify-center">
            <BarChart></BarChart>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
