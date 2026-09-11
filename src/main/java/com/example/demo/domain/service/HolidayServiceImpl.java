package com.example.demo.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.entity.Holiday;
import com.example.demo.form.HolidaySearchForm;
import com.example.demo.repository.HolidayMapper;

@Service
@Transactional(rollbackFor = Exception.class)
public class HolidayServiceImpl implements HolidayService {

	@Autowired
	private HolidayMapper holidayMapper;

	/*
	 * 検索条件の祝日一覧検索
	 */
	@Override
	@Transactional(readOnly = true)
	public List<Holiday> getHolidayList(HolidaySearchForm form) {
		return holidayMapper.selectByConditions(form);
	}

	/*
	 * 総件数取得
	 */
	@Override
	@Transactional(readOnly = true)
	public long getHolidayCount(HolidaySearchForm form) {
		return holidayMapper.countByConditions(form);
	}

	/**
	 * 新規登録
	 */
	@Override
	public int registerHoliday(Holiday holiday) {
		return holidayMapper.insertOne(holiday);
	}

	/**
	 * 1件取得（更新用の詳細取得）
	 */
	@Override
	public Holiday selectOne(int id) {
		return holidayMapper.selectOne(id);
	}

	/**
	 * 更新登録
	 */
	@Override
	public int updateHoliday(Holiday holiday) {
		return holidayMapper.updateOne(holiday);
	}

	/**
	 * 削除処理
	 */
	@Override
	public int deleteHoliday(int id) {

		return holidayMapper.deleteOne(id);
	}

}
