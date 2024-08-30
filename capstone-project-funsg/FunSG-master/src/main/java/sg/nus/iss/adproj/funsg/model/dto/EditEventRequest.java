package sg.nus.iss.adproj.funsg.model.dto;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class EditEventRequest {
    private String name;
    private String description;
    private LocalDateTime start;
    private LocalDateTime end;
    private String location;
    private int maxParticipants;
    private String profileImagePath;
}
