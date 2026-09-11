package com.example.demo.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmployeeCreateForm {

	@NotBlank(message = "社員番号は必須入力です")
	@Size(max = 20, message = "社員番号は20文字以内で入力してください")
	private String employeeNo;

	@NotBlank(message = "社員名は必須入力です")
	private String employeeName;

	@NotBlank(message = "メールアドレスは必須入力です")
	@Email(message = "正しいメールアドレスの形式で入力してください")
	private String email;

	@NotBlank(message = "入社日は必須入力です")
	private String startDate;

	@NotBlank(message = "パスワードは必須入力です")
	private String password;
	
	@NotBlank(message = "確認用パスワードは必須入力です")
	private String lastPass;
	
	@NotNull(message = "権限は必須選択です")
	private Integer roleCd;
}
