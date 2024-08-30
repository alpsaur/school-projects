package sg.nus.iss.adproj.funsg.model.dto;


import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CreateEventRequest {
    private String name;

    private LocalDateTime start;

    private LocalDateTime end;

    private String description;

    private String location;

    private int maxParticipants;

    private String eventImageUrl;

}
