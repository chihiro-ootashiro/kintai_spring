package com.example.demo.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.entity.Holiday;
import com.example.demo.form.HolidaySearchForm;

@Mapper
public interface HolidayMapper {
	// 条件に合う祝日データを5件ずつ取得
	List<Holiday> selectByConditions(HolidaySearchForm form);

	// 条件に合う総件数を取得
	long countByConditions(HolidaySearchForm form);

	/** 1件新規登録 */
	public int insertOne(Holiday holiday);

	/**
	 * 1件取得（更新用の詳細取得）
	 */
	public Holiday selectOne(int id);

	/**
	 * 更新登録
	 */
	public int updateOne(Holiday Holiday);

	/**
	 * 削除処理
	 */
	public int deleteOne(int id);
}