package com.nus.iss.funsg;

public class AuthGroupCommentRequest {
    private String content;

    public AuthGroupCommentRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
