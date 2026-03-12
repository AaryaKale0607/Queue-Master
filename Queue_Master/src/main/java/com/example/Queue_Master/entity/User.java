package com.example.Queue_Master.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;   // stored as BCrypt hash

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public User() {}

    public User(String username, String email, String password, Role role) {
        this.username = username;
        this.email    = email;
        this.password = password;
        this.role     = role;
    }

    public Long getId()                  { return id; }
    public String getUsername()          { return username; }
    public void setUsername(String u)    { this.username = u; }
    public String getEmail()             { return email; }
    public void setEmail(String e)       { this.email = e; }
    public String getPassword()          { return password; }
    public void setPassword(String p)    { this.password = p; }
    public Role getRole()                { return role; }
    public void setRole(Role r)          { this.role = r; }
}