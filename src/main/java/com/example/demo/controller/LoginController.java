package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

	/**
	 * ログイン画面表示 (GET)
	 * 
	 */
	@GetMapping("/login")
	public String login() {
		return "login/login";
	}

	/**
	 * ログイン失敗時 (GET)
	 * 
	 */
	@GetMapping("/login/error")
	public String loginError(Model model) {
		// 
		model.addAttribute("message", "メールアドレスまたはパスワードが間違っています。");
		return "login/login";
	}
}
