package com.example.Queue_Master.dto;

public class LoginRequest {

    private String usernameOrEmail;  // ← must be this exact name
    private String password;

    public LoginRequest() {}

    public String getUsernameOrEmail()         { return usernameOrEmail; }
    public void setUsernameOrEmail(String u)   { this.usernameOrEmail = u; }
    public String getPassword()                { return password; }
    public void setPassword(String p)          { this.password = p; }
}