package com.example.demo.form;

import lombok.Data;

@Data
public class HolidaySearchForm {
    private String date;        
    private String holidayName;
    private int page = 1;       // 現在のページ番号（初期値：1）
    private final int size = 5; // 1ページあたりの表示件数

    public int getOffset() {
        return (this.page - 1) * this.size;
    }
}
