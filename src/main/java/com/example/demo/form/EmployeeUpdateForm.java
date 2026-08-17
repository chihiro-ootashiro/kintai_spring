package com.example.demo.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EmployeeUpdateForm {

    @NotBlank(message = "社員番号は必須入力です")
    private String employeeNo;

    @NotBlank(message = "社員名は必須入力です")
    private String employeeName;

    @NotBlank(message = "メールアドレスは必須入力です")
    @Email(message = "正しいメールアドレスの形式で入力してください")
    private String email;

    @NotBlank(message = "入社日は必須入力です")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "入社日はYYYY-MM-DDの形式で入力してください")
    private String startDate;

    @NotNull(message = "権限は必須選択です")
    private Integer roleCd;

    private String password;
}