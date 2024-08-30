package sg.nus.iss.adproj.funsg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sg.nus.iss.adproj.funsg.model.entity.Comment;
import sg.nus.iss.adproj.funsg.model.entity.Event;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AdminUserResponse {
    private Long userId;
    private String name;
    private String email;
    private String profileImage;
    private String status;
    private LocalDateTime createdAt;
    private int IE_Tendancy;
    private int NS_Tendancy;
    private int TF_Tendancy;
    private int JP_Tendancy;
    private List<String> events;
    private List<String> groups;
    private List<String> hostedGroups;
}
