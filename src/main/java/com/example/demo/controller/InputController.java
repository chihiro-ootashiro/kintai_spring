package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

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

	/**
	 * Reactから呼ばれる祝日データ取得用
	 */
	@GetMapping("/api/holidays")
	@ResponseBody
	public String getHolidays() {
		// ブラウザの代わりにJavaが外部APIを呼び出す
		String url = "https://holidays-jp.github.io/api/v1/date.json";
		RestTemplate restTemplate = new RestTemplate();
		
		return restTemplate.getForObject(url, String.class);
	}
}
