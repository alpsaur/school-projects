package com.nus.iss.funsg;

public class AuthGroupCommentResponse {
    private String content;
    private String postedAt;
    private AuthUserProfileResponse user;

    public AuthGroupCommentResponse(String content, String postedAt, AuthUserProfileResponse user) {
        this.content = content;
        this.postedAt = postedAt;
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(String postedAt) {
        this.postedAt = postedAt;
    }

    public AuthUserProfileResponse getUser() {
        return user;
    }

    public void setUser(AuthUserProfileResponse user) {
        this.user = user;
    }
}
