package sg.nus.iss.adproj.funsg.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminStatusUpdateRequest {
    private String status;
    private String message;
}
