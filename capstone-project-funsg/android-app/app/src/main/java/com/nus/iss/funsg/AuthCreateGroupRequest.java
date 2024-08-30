package com.nus.iss.funsg;

public class AuthCreateGroupRequest {
    private Long categoryId;
    private String name;
    private String description;
    private String groupImageUrl;

    public AuthCreateGroupRequest(Long categoryId, String name, String description, String groupImageUrl) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.groupImageUrl = groupImageUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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

    public String getGroupImageUrl() {
        return groupImageUrl;
    }

    public void setGroupImageUrl(String groupImageUrl) {
        this.groupImageUrl = groupImageUrl;
    }
}
