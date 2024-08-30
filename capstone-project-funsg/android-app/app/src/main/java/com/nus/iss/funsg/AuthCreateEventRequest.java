package com.nus.iss.funsg;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AuthCreateEventRequest {
    private String name;
    private String start;
    private String end;
    private String description;
    private String location;
    private int maxParticipants;
    private String eventImageUrl;

    public AuthCreateEventRequest(String name, String start, String end, String description, String location, int maxParticipants, String eventImageUrl) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.description = description;
        this.location = location;
        this.maxParticipants = maxParticipants;
        this.eventImageUrl = eventImageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public String getEventImageUrl() {
        return eventImageUrl;
    }

    public void setEventImageUrl(String eventImageUrl) {
        this.eventImageUrl = eventImageUrl;
    }
    public static String formatDateTime(LocalDateTime dateTime){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        return dateTime.format(formatter);
    }
}
