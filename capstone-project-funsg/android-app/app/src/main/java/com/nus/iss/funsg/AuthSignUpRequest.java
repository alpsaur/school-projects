package com.nus.iss.funsg;

public class AuthSignUpRequest {
    private String username;
    private String email;
    private String password;
    public AuthSignUpRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
