package com.example.demo.form;

import lombok.Data;

@Data
public class EmployeeSearchForm {
	private String employeeNo;
	private String employeeName;
	private String email;
	private String startDate;
	private Integer roleCd;

}
