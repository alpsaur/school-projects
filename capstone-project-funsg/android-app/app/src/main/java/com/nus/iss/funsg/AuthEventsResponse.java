package com.nus.iss.funsg;

import java.util.List;

public class AuthEventsResponse {
    private Long id;
    private String name;
    private String description;
    private String start;
    private String end;
    private String location;
    private Long groupId;
    private String groupName;
    private String createdAt;
    private AuthUserProfileResponse createdBy;
    private String profileImagePath;
    private int maxParticipants;
    private List<AuthUserProfileResponse> eventParticipants;

    public AuthEventsResponse(Long id, String name, String description, String start, String end, String location, Long groupId, String groupName, String createdAt, AuthUserProfileResponse createdBy, String profileImagePath, int maxParticipants, List<AuthUserProfileResponse> eventParticipants) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start = start;
        this.end = end;
        this.location = location;
        this.groupId = groupId;
        this.groupName = groupName;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.profileImagePath = profileImagePath;
        this.maxParticipants = maxParticipants;
        this.eventParticipants = eventParticipants;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public AuthUserProfileResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(AuthUserProfileResponse createdBy) {
        this.createdBy = createdBy;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public int getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public List<AuthUserProfileResponse> getEventParticipants() {
        return eventParticipants;
    }

    public void setEventParticipants(List<AuthUserProfileResponse> eventParticipants) {
        this.eventParticipants = eventParticipants;
    }
}
