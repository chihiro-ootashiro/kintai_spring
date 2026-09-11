package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.demo.domain.entity.Holiday;
import com.example.demo.domain.service.HolidayService;
import com.example.demo.form.HolidaySearchForm;

@Controller
@RequestMapping("/holiday")
public class HolidayController {

	@Autowired
	private HolidayService holidayService;

	/**
	* 勤怠管理画面のURL
	*/
	@GetMapping("/list")
	public String holidayMaster(@ModelAttribute HolidaySearchForm form, Model model) {

		//検索条件で祝日データと総件数を取得
		List<Holiday> holidayList = holidayService.getHolidayList(form);
		long totalCount = holidayService.getHolidayCount(form);

		//1ページあたり5件で総ページ数を計算
		int totalPages = (int) Math.ceil((double) totalCount / form.getSize());
		if (totalPages == 0) {
			totalPages = 1;
		}

		// 画面へデータを渡す
		model.addAttribute("holidayList", holidayList);
		model.addAttribute("totalPages", totalPages);
		// BindingResultのエラーを初期登録フォームに引き継ぐため、存在しない場合のみ新規オブジェクトを生成
		if (!model.containsAttribute("holiday")) {
			model.addAttribute("holiday", new Holiday());
		}
		model.addAttribute("holidaySearchForm", form);

		return "holiday/list";
	}

	/**
	* 検索条件のクリア処理
	*/
	@GetMapping("/clear")
	public String clearHolidaySearch() {
		// 検索条件をクリアして、初期一覧画面へ
		return "redirect:/holiday/list";
	}

	/**
	 * 新規登録
	 */
	@PostMapping("/register")
	public String registerHoliday(
			@Validated @ModelAttribute Holiday holiday,
			BindingResult bindingResult,
			RedirectAttributes redirectAttributes,
			Model model) {

		if (bindingResult.hasErrors()) {
			//Spring標準のキー名でエラーを渡す
			redirectAttributes.addFlashAttribute("BindingResult.holiday", bindingResult);
			redirectAttributes.addFlashAttribute("holiday", holiday);
			//画面側に errorType として "register" を渡す
			redirectAttributes.addFlashAttribute("errorType", "register");
			return "redirect:/holiday/list";
		}

		holidayService.registerHoliday(holiday);
		return "redirect:/holiday/list";
	}

	/**
	 * 更新画面の内容表示
	 * 一覧からIDを受け取り、対象のデータを1件取得して画面に渡す
	 */
	@GetMapping("/edit")
	public String editHoliday(@RequestParam("id") Integer id, Model model) {

		// バリデーションエラーからのリダイレクトで既にデータがある場合は、何もしない
		if (!model.containsAttribute("holiday")) {
			// idをもとに情報を一件分取得
			Holiday holiday = holidayService.selectOne(id);
			// 更新画面にデータ渡す
			model.addAttribute("holiday", holiday);
		}

		return "holiday/edit";
	}

	/**
	 * 更新処理
	 */
	@PostMapping("/update")
	public String updateHoliday(
			@Validated @ModelAttribute Holiday holiday,
			BindingResult bindingResult,
			RedirectAttributes redirectAttributes) {

		if (bindingResult.hasErrors()) {
			redirectAttributes.addFlashAttribute("BindingResult.holiday", bindingResult);
			redirectAttributes.addFlashAttribute("holiday", holiday);
			redirectAttributes.addFlashAttribute("errorType", "update");
			return "redirect:/holiday/edit?id=" + holiday.getId();
		}

		holidayService.updateHoliday(holiday);
		return "redirect:/holiday/list";
	}

	/*
	 * 削除処理
	 */
	@PostMapping("/delete")
	public String deleteHoliday(
			@RequestParam("id") int id) {
		//Serviceの削除処理を呼ぶ
		holidayService.deleteHoliday(id);

		return "redirect:/holiday/list";
	}
}
