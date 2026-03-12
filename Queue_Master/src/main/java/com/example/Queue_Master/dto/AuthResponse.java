package com.example.Queue_Master.dto;

import com.example.Queue_Master.entity.Role;

public class AuthResponse {

    private String token;
    private Long   userId;
    private String username;
    private String email;      // ← must be here
    private Role   role;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String username,
                        String email, Role role, String message) {
        this.token    = token;
        this.userId   = userId;
        this.username = username;
        this.email    = email;   // ← must be set
        this.role     = role;
        this.message  = message;
    }

    public String getToken()           { return token; }
    public void setToken(String t)     { this.token = t; }
    public Long getUserId()            { return userId; }
    public void setUserId(Long id)     { this.userId = id; }
    public String getUsername()        { return username; }
    public void setUsername(String u)  { this.username = u; }
    public String getEmail()           { return email; }
    public void setEmail(String e)     { this.email = e; }
    public Role getRole()              { return role; }
    public void setRole(Role r)        { this.role = r; }
    public String getMessage()         { return message; }
    public void setMessage(String m)   { this.message = m; }
}