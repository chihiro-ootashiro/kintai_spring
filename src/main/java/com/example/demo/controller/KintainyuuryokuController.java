package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class KintainyuuryokuController {
	
	

	/**
	 * 勤怠入力 GET
	 * @param locale
	 * @return
	 */
	@GetMapping("/kintai/index")
	public String index() {

		//html
		return "Kintai/index";
	}
}
