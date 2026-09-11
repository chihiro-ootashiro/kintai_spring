package com.example.demo.domain.entity;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Holiday {
	private Integer id;
	
	@NotBlank(message = "日付を入力してください")
	private String holidayDate;
	
	@NotBlank(message = "祝日名を入力してください")
	private String holidayName;
	
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}