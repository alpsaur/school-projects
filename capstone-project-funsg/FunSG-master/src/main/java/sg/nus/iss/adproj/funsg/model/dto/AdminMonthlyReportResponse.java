package sg.nus.iss.adproj.funsg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AdminMonthlyReportResponse {
   private List<AdminMonthlyReportMetrics> metrics;
   private List<UserProfileResponse> newUsers;
   private List<AdminGroupResponse> newGroups;
   private List<EventInfoResponse> newEvents;
}

