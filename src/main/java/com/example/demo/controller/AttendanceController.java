package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/attendance")
public class AttendanceController {
	 /**
     * 勤怠管理画面のURL
     */
	@GetMapping("/list")
    public String attendanceMaster() {
        return "attendance/list";
    }
}
