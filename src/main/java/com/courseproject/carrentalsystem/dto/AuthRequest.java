package com.courseproject.carrentalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String licenseNumber;
    private String role; // "CUSTOMER" or "ADMIN"
}
