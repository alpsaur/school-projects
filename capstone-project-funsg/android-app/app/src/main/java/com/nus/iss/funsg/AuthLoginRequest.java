package com.nus.iss.funsg;

public class AuthLoginRequest {
    //this class is use for login validation


    private String email;
    private String password;
    public AuthLoginRequest(){}

    public AuthLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
