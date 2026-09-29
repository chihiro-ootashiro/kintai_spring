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

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/holiday")
public class HolidayController {

	@Autowired
	private HolidayService holidayService;

	/**
	 * 祝日マスタ画面のURL
	 */
	@GetMapping("/list")
	public String holidayMaster(
			@ModelAttribute("holidaySearchForm") HolidaySearchForm form,
			Model model,
			HttpSession session) {

		//  クリア処理からリダイレクトされてきたか判定
		boolean isClearAction = model.containsAttribute("isClearAction");

		if (isClearAction) {
			// セッションから直前の検索条件を取得
			HolidaySearchForm savedForm = (HolidaySearchForm) session.getAttribute("savedHolidaySearchForm");
			if (savedForm != null) {
				// 検索には直前の条件を使うが、ページ番号だけはリダイレクトで指定されたものを適用
				savedForm.setPage(form.getPage());

				// サービスには直前の条件を渡して検索結果を維持する
				List<Holiday> holidayList = holidayService.getHolidayList(savedForm);
				long totalCount = holidayService.getHolidayCount(savedForm);
				int totalPages = (int) Math.ceil((double) totalCount / savedForm.getSize());

				model.addAttribute("holidayList", holidayList);
				model.addAttribute("totalPages", totalPages == 0 ? 1 : totalPages);
			} else {
				// 万が一セッションにない場合は通常の空検索
				executeHolidaySearch(form, model);
			}

			// 画面に渡すフォームは空（ページ番号は維持）にする
			HolidaySearchForm emptyForm = new HolidaySearchForm();
			emptyForm.setPage(form.getPage());
			model.addAttribute("holidaySearchForm", emptyForm);

		} else {
			// 通常の検索時　ボタン押下時など
			// 現在の検索条件をセッションに保存（次回クリア時に使うため）
			session.setAttribute("savedHolidaySearchForm", form);

			// 通常の検索処理を実行
			executeHolidaySearch(form, model);
		}

		if (!model.containsAttribute("holiday")) {
			model.addAttribute("holiday", new Holiday());
		}

		return "holiday/list";
	}

	/**
	 * 共通の検索・ページング処理
	 */
	private void executeHolidaySearch(HolidaySearchForm form, Model model) {
		List<Holiday> holidayList = holidayService.getHolidayList(form);
		long totalCount = holidayService.getHolidayCount(form);

		int totalPages = (int) Math.ceil((double) totalCount / form.getSize());
		if (totalPages == 0) {
			totalPages = 1;
		}

		model.addAttribute("holidayList", holidayList);
		model.addAttribute("totalPages", totalPages);
	}

	/**
	 * 検索条件のクリア処理
	 */
	@GetMapping("/clear")
	public String clearHolidaySearch(
			@RequestParam(value = "page", defaultValue = "1") int page,
			RedirectAttributes redirectAttributes) {


		redirectAttributes.addFlashAttribute("isClearAction", true);

		//現在のページ番号はそのまま引き継ぐ
		redirectAttributes.addAttribute("page", page);

		return "redirect:/holiday/list";
	}

	/**
	 * 新規登録
	 */
	@PostMapping("/register")
	public String registerHoliday(
			@Validated @ModelAttribute("holiday") Holiday holiday,
			BindingResult bindingResult,
			@RequestParam(value = "searchDate", required = false) String searchDate,
			@RequestParam(value = "searchHolidayName", required = false) String searchHolidayName,
			@RequestParam(value = "searchPage", defaultValue = "1") int searchPage,
			RedirectAttributes redirectAttributes) {

		// 受け取った元の検索条件をリダイレクト先に引き継ぐ
		addSearchParamAttributes(redirectAttributes, searchDate, searchHolidayName, searchPage);

		if (bindingResult.hasErrors()) {
			redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.holiday", bindingResult);
			redirectAttributes.addFlashAttribute("holiday", holiday);
			redirectAttributes.addFlashAttribute("errorType", "register");
			return "redirect:/holiday/list";
		}

		holidayService.registerHoliday(holiday);
		return "redirect:/holiday/list";
	}

	/**
	 * 更新処理
	 */
	@PostMapping("/update")
	public String updateHoliday(
			@Validated @ModelAttribute("holiday") Holiday holiday,
			BindingResult bindingResult,
			@RequestParam(value = "searchDate", required = false) String searchDate,
			@RequestParam(value = "searchHolidayName", required = false) String searchHolidayName,
			@RequestParam(value = "searchPage", defaultValue = "1") int searchPage,
			RedirectAttributes redirectAttributes) {

		// 現在の検索条件をリダイレクト先のクエリパラメータにつける
		addSearchParamAttributes(redirectAttributes, searchDate, searchHolidayName, searchPage);

		if (bindingResult.hasErrors()) {
			redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.holiday", bindingResult);
			redirectAttributes.addFlashAttribute("holiday", holiday);
			redirectAttributes.addFlashAttribute("errorType", "update");
			return "redirect:/holiday/list";
		}

		holidayService.updateHoliday(holiday);
		return "redirect:/holiday/list";
	}

	/*
	 * 削除処理
	 */
	@PostMapping("/delete")
	public String deleteHoliday(
			@RequestParam("id") int id,
			@RequestParam(value = "searchDate", required = false) String searchDate,
			@RequestParam(value = "searchHolidayName", required = false) String searchHolidayName,
			@RequestParam(value = "searchPage", defaultValue = "1") int searchPage,
			RedirectAttributes redirectAttributes) {

		holidayService.deleteHoliday(id);

		// 削除後も現在の検索条件をリダイレクト先のクエリパラメータに与える
		addSearchParamAttributes(redirectAttributes, searchDate, searchHolidayName, searchPage);
		return "redirect:/holiday/list";
	}

	/**
	 * 検索条件をクエリパラメータに詰め替える共通メソッド
	 */
	private void addSearchParamAttributes(RedirectAttributes redirectAttributes, String date, String holidayName,
			int page) {
		redirectAttributes.addAttribute("date", date);
		redirectAttributes.addAttribute("holidayName", holidayName);
		redirectAttributes.addAttribute("page", page);
	}
}
