package com.example.demo.domain.model;

import lombok.Data;

@Data
public class EmployeeModel {
	private Integer id;
	private String employeeNo;
	private String employeeName;
	private String email;
	private String startDate;
	private Integer roleCd;
	private String roleName;
	private String password; 
}
