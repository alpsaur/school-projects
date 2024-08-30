package sg.nus.iss.adproj.funsg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sg.nus.iss.adproj.funsg.model.entity.Member;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AdminGroupResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private Long categoryId;
    private String categoryName;
    private String status;
    private String profileImagePath;
    private String host;
    private int numOfMember;
    private List<UserProfileResponse> members;
    private int numOfEvent;
    private List<EventInfoResponse>events;

}
