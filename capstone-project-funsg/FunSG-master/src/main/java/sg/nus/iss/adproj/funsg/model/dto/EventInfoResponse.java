package sg.nus.iss.adproj.funsg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class EventInfoResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime start;
    private LocalDateTime end;
    private String location;
    private String categoryName;
    private Long groupId;
    private String groupName;
    private LocalDateTime createdAt;
    private UserProfileResponse createdBy;
    private int maxParticipants;
    private String status;
    private String profileImagePath;
    private List<UserProfileResponse> eventParticipants;
    private List<String> eventArtifactFilePaths;
}
