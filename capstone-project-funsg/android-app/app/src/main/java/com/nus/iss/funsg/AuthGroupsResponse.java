package com.nus.iss.funsg;

import java.util.List;

public class AuthGroupsResponse {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String profileImagePath;
    private String status;
    private AuthUserProfileResponse host;
    private List<AuthUserProfileResponse> members;

    public AuthGroupsResponse(Long id, String name, String description, Long categoryId, String categoryName, String profileImagePath, String status, AuthUserProfileResponse host, List<AuthUserProfileResponse> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.profileImagePath = profileImagePath;
        this.status = status;
        this.host = host;
        this.members = members;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public AuthUserProfileResponse getHost() {
        return host;
    }

    public void setHost(AuthUserProfileResponse host) {
        this.host = host;
    }

    public List<AuthUserProfileResponse> getMembers() {
        return members;
    }

    public void setMembers(List<AuthUserProfileResponse> members) {
        this.members = members;
    }
}
