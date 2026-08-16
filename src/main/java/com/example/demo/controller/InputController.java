package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/employee")
public class InputController {
	/**
	* 勤怠入力のURL
	*/
	@GetMapping("/input")
	public String input() {
		return "input/input";
	}
}
