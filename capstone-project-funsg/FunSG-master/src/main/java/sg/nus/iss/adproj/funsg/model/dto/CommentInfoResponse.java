package sg.nus.iss.adproj.funsg.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CommentInfoResponse {

    private String content;

    private LocalDateTime postedAt;

    private UserProfileResponse user;
}
