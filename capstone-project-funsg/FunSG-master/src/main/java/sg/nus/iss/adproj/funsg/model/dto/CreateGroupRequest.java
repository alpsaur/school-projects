package sg.nus.iss.adproj.funsg.model.dto;

import lombok.Getter;
import sg.nus.iss.adproj.funsg.model.entity.Category;

import java.time.LocalDateTime;

@Getter
public class CreateGroupRequest {
    private Long categoryId;

    private String name;

    private String description;

    private String groupImageUrl;


}
