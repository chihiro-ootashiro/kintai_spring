package com.example.demo.domain.service;

import java.util.List;

import com.example.demo.domain.entity.Holiday;
import com.example.demo.form.HolidaySearchForm;

public interface HolidayService {
	
	/**
	 * 祝日一覧取得
	 */
	public List<Holiday> getHolidayList(HolidaySearchForm form);
	
	/*
	 * 総件数取得
	 */
	public long getHolidayCount(HolidaySearchForm form);
	
	/**
	 * 新規登録
	 */
	public int registerHoliday(Holiday holiday);
	
	/**
	 * 1件取得（更新用の詳細取得）
	 */
	public Holiday selectOne(int id);
	
	/**
	 * 更新登録
	 */
	public int updateHoliday(Holiday holiday);
	
	/**
	 * 削除処理
	 */
	public int deleteHoliday(int id);


}
