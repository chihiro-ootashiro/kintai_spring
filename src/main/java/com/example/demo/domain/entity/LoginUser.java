package com.example.demo.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LoginUser {
 private Integer id;
 private String employeeNo;
 private String employeeName;
 private String email;
 private LocalDate startDate;
 private String password;
 private Integer roleCd;
 private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
 
 
}
