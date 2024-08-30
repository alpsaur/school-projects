import apiClient from "../services/api-client.ts";
import { useQuery } from "@tanstack/react-query";
import { Group } from "./useGroups.ts";

interface MonthlyReportMetrics {
  title: string;
  totalNumber: number;
  growth: number;
  changeType: string;
}

interface UserProfileResponse {
  userId: number;
  name: string;
  email: string;
  profileImage: string;
  createdAt: string; // Assuming ISO string for datetime
}

interface EventInfoResponse {
  id: number;
  name: string;
  description: string;
  start: string; // Assuming ISO string for datetime
  end: string; // Assuming ISO string for datetime
  location: string;
  categoryName: string;
  groupId: number;
  groupName: string;
  createdAt: string; // Assuming ISO string for datetime
  createdBy: UserProfileResponse;
  maxParticipants: number;
  status: string;
  profileImagePath: string;
  eventParticipants: UserProfileResponse[];
  eventArtifactFilePaths: string[];
}

interface AdminMonthlyReport {
  metrics: MonthlyReportMetrics[];
  newUsers: UserProfileResponse[];
  newGroups: Group[];
  newEvents: EventInfoResponse[];
}

const useReport = (selectedYear?: number, selectedMonth?: number) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const year = selectedYear || currentYear;
  const month = selectedMonth || currentMonth;

  const fetchReport = () =>
    apiClient
      .get<AdminMonthlyReport>("/admin/monthlyReport/data", {
        params: { year, month },
      })
      .then((res) => res.data);

  return useQuery<AdminMonthlyReport, Error>({
    queryKey: ["reports", year, month],
    queryFn: fetchReport,
    staleTime: 10 * 1000,
  });
};

export default useReport;
