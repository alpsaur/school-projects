package sg.nus.iss.adproj.funsg.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sg.nus.iss.adproj.funsg.model.dto.AdminGroupResponse;
import sg.nus.iss.adproj.funsg.model.dto.EventInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.GroupInfoResponse;
import sg.nus.iss.adproj.funsg.model.dto.UserProfileResponse;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class MonthlyReport {
    private int newUsersThisMonth;
    private float userGrowth;
    private int newGroupsThisMonth;
    private float groupGrowth;
    private int newEventsThisMonth;
    private float eventGrowth;
    private List<UserProfileResponse> newUsers;
    private List<AdminGroupResponse> newGroups;
    private List<EventInfoResponse> newEvents;
}
