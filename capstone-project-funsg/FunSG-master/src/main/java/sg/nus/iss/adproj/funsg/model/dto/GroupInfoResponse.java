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
public class GroupInfoResponse {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String status;
    private String profileImagePath;
    private UserProfileResponse host;
    private List<UserProfileResponse> members;
    private int numberOfEvents;
}
