import { useState } from "react";
import useReport from "../hooks/useReport.ts";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "./catalystui/dialog.tsx";
import { Button } from "./catalystui/button.tsx";
import clsx from "clsx";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./catalystui/table.tsx";
import { Label } from "./catalystui/fieldset.tsx";
import { Input } from "./catalystui/input.tsx";
import * as Headless from "@headlessui/react";
import apiClient from "../services/api-client.ts";

interface ReportModalProps {
  onClose: () => void;
}

const ReportModal = ({ onClose }: ReportModalProps) => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const { data: report, isLoading, error } = useReport(year, month);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedYear, selectedMonth] = event.target.value
      .split("-")
      .map(Number);
    setYear(selectedYear);
    setMonth(selectedMonth);
  };

  const handleClose = () => {
    onClose();
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth() + 1);
  };
  const handleDownload = () => {
    const currentDate = new Date();
    const thisYear = currentDate.getFullYear();
    console.log("currentdate: " + currentDate.getMonth());
    const thisMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const fileName = `monthly_report_${thisYear}-${thisMonth}-${day}.csv`;

    apiClient
      .get("/admin/monthlyReport", {
        params: { year: year, month: month },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        // document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading the file", error);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading report data.</div>;
  }

  return (
    <Dialog open onClose={handleClose} size="4xl">
      <div className="flex items-center space-x-4 justify-between">
        <DialogTitle>
          <h2 className="text-xl font-semibold text-center text-gray-900">
            {year && year.toLocaleString()} {month && monthNames[month - 1]}{" "}
            Report
          </h2>
        </DialogTitle>
        <Headless.Field className="flex items-baseline gap-6">
          <Label htmlFor="month" className="text-xs whitespace-nowrap">
            Select Months
          </Label>
          <Input
            type="month"
            id="month"
            name="month"
            className="max-w-48"
            placeholder="YYYY-MM"
            onChange={handleMonthChange}
          />
        </Headless.Field>
      </div>
      <DialogBody>
        <div>
          <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
            {report.metrics.map((item) => (
              <div key={item.title} className="px-4 py-5 sm:p-6">
                <dt className="text-base font-normal text-gray-900">
                  {item.title}
                </dt>
                <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                  <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                    {item.totalNumber}
                  </div>

                  <div
                    className={clsx(
                      item.changeType === "increase"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                      "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0",
                    )}
                  >
                    {item.changeType === "increase" ? (
                      <ArrowUpIcon
                        aria-hidden="true"
                        className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      />
                    ) : (
                      <ArrowDownIcon
                        aria-hidden="true"
                        className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      />
                    )}
                    <span className="sr-only">
                      {" "}
                      {item.changeType === "increase"
                        ? "Increased"
                        : "Decreased"}{" "}
                      by{" "}
                    </span>
                    {item.growth} %
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="mt-8 mb-3 font-bold">
            Preview of Newly Sign Up Users
          </h3>
          {report.newUsers.length === 0 && (
            <p> No new users sign up in this month :(</p>
          )}
          {report.newUsers.length > 0 && (
            <Table
              dense
              className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
            >
              <TableHead>
                <TableRow>
                  <TableHeader className="text-start w-1/8">Id</TableHeader>
                  <TableHeader className="text-start w-1/4">Name</TableHeader>
                  <TableHeader className="text-start w-3/8">Email</TableHeader>
                  <TableHeader className="text-start w-1/4">
                    Created At
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.newUsers.slice(0, 5).map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="text-start tabular-nums w-1/8">
                      {user.userId}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-1/4">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-3/8">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-1/4">
                      {user.createdAt.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div>
          <h3 className="mt-8 mb-3 font-bold">
            Preview of Newly Formed Groups
          </h3>
          {report.newGroups.length === 0 && (
            <p> No new groups created in this month :(</p>
          )}
          {report.newGroups.length > 0 && (
            <Table
              dense
              className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
            >
              <TableHead>
                <TableRow>
                  <TableHeader className="text-start w-1/8">Id</TableHeader>
                  <TableHeader className="text-start w-1/4">Name</TableHeader>
                  <TableHeader className="text-start w-3/8">Host</TableHeader>
                  <TableHeader className="text-start w-1/4">
                    Created At
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.newGroups.slice(0, 5).map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="text-start tabular-nums w-1/8">
                      {group.id}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-1/4">
                      {group.name}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-3/8">
                      {group.host}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-1/4">
                      {group.createdAt.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h3 className="mt-8 mb-3 font-bold">
            Preview of Newly Organised Events
          </h3>
          {report.newEvents.length === 0 && (
            <p> No new events created in this month :(</p>
          )}
          {report.newEvents.length > 0 && (
            <Table
              dense
              className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
            >
              <TableHead>
                <TableRow>
                  <TableHeader className="text-start w-1/8">Id</TableHeader>
                  <TableHeader className="text-start w-1/4">Name</TableHeader>
                  <TableHeader className="text-start w-3/8">
                    Start Date
                  </TableHeader>
                  <TableHeader className="text-start w-1/4">
                    Created At
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.newEvents.slice(0, 5).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-start tabular-nums w-1/8">
                      {event.id}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-1/4">
                      {event.name}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-3/8">
                      {event.start.substring(0, 10)}
                    </TableCell>
                    <TableCell className="text-start tabular-nums w-1/4">
                      {event.createdAt.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogBody>
      <DialogActions>
        <Button color="sky" onClick={handleDownload}>
          Download Full Report
        </Button>
        <Button color="zinc" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
