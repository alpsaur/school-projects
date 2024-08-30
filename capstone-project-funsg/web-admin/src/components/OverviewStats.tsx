import useStats from "../hooks/useStats.ts";
import {
  CalendarIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const OverviewStats = () => {
  const { data, isLoading, error } = useStats();
  const linkItems = [
    { id: 1, label: "Users", url: "/home/users" },
    { id: 2, label: "Groups", url: "/home/groups" },
    { id: 3, label: "Events", url: "/home/events" },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.statItems.map((item) => (
        <div
          key={item.id}
          className="relative overflow-hidden rounded-lg bg-white px-4 pb-16 pt-8 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className="absolute rounded-md bg-cyan-500 p-3">
              {item.id === 1 && (
                <UserPlusIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              )}

              {item.id === 2 && (
                <UserGroupIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              )}

              {item.id === 3 && (
                <CalendarIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              )}
            </div>
            <p className="ml-16 truncate text-xl font-medium text-gray-500">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline sm:pb-7">
            <div className="w-full flex justify-end mt-2 px-6">
              <p className="text-5xl font-semibold tracking-tight text-cyan-700 mt-6">
                {item.stat}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-6 sm:px-6 ">
              <div className="text-sm text-center">
                <a
                  href={
                    linkItems.find((linkItem) => linkItem.id === item.id)
                      ?.url || "#"
                  }
                  className="font-medium text-cyan-700 hover:text-indigo-500"
                >
                  View all<span className="sr-only"> {item.name} stats</span>
                </a>
              </div>
            </div>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default OverviewStats;
