package com.example.demo.form;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EmployeeCreateForm {

	private String employeeNo;
	private String employeeName;
	private String email;
	private LocalDate startDate;
	private String password;
	private Integer roleCd;
}
