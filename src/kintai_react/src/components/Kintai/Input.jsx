import { useState, useEffect } from "react";

export default function Input() {
  const getInitialMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const [calendarDays, setCalendarDays] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [apiHolidays, setApiHolidays] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // 同じサーバー内（ポート8080など）であれば、相対パスで指定するのが最も安全です
    fetch("/employee/api/holidays")
      .then((res) => {
        if (!res.ok) throw new Error("Javaサーバー側での取得失敗");
        return res.json();
      })
      .then((data) => {
        setApiHolidays(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Javaからのデータ取得エラー:", err);
        setIsLoading(false);
      });
  }, []);


  // Hookを使用した場合の正しい記述
  useEffect(() => {
    fetch("https://holidays-jp.github.io/api/v1/date.json")
      .then(response => response.json())
      .then(data => {
        // 1. Hook用のState更新関数を使う
        setApiHolidays(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const generateCalendar = (monthStr) => {
    if (!monthStr) {
      setHasError(true);
      setCalendarDays([]);
      return;
    }
    // (この後にカレンダー生成ロジックが続きます)


    setHasError(false);
    const [year, month] = monthStr.split('-').map(Number);
    const daysArray = [];

    const endDate = new Date(year, month, 0);
    const totalDays = endDate.getDate();
    const weekIdx = ['日', '月', '火', '水', '木', '金', '土'];

    for (let i = 1; i <= totalDays; i++) {
      const currentDays = new Date(year, month - 1, i);
      const dayOfWeek = weekIdx[currentDays.getDay()];
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      const isHoliday = !!apiHolidays[dateStr];
      const holidayName = apiHolidays[dateStr] || "";

      const isSunday = dayOfWeek === '日';
      const isSaturday = dayOfWeek === '土';

      const isRedDay = isSunday || isHoliday;
      const isOffMode = isSunday || isSaturday || isHoliday;

      daysArray.push({
        dayNumber: i,
        dayOfWeek: dayOfWeek,
        isRedDay,
        isSaturday,
        kbn: isOffMode ? "公休" : "出勤",
        startTime: isOffMode ? "" : "09:00",
        endTime: isOffMode ? "" : "18:00",
        restTime: isOffMode ? "" : "01:00",
        nightRestTime: isOffMode ? "" : "00:00",
        bikou: holidayName
      });
    }

    setCalendarDays(daysArray);
  };

  useEffect(() => {
    if (!isLoading) {
      generateCalendar(selectedMonth);
    }
  }, [selectedMonth, apiHolidays, isLoading]);

  const handleRowChange = (dayNumber, field, value) => {
    setCalendarDays((prevDays) =>
      prevDays.map((day) => {
        if (day.dayNumber === dayNumber) {
          const updatedDay = { ...day, [field]: value };
          if (field === "kbn" && value === "公休") {
            updatedDay.startTime = ""; updatedDay.endTime = ""; updatedDay.restTime = ""; updatedDay.nightRestTime = "";
          } else if (field === "kbn" && value === "出勤") {
            updatedDay.startTime = "09:00"; updatedDay.endTime = "18:00"; updatedDay.restTime = "01:00"; updatedDay.nightRestTime = "00:00";
          }
          return updatedDay;
        }
        return day;
      })
    );
  };

  return (
    <div className="container mt-4">
      <h2>勤怠管理システム</h2>

      {hasError && (
        <div className="alert alert-warning py-2 mb-3"><strong>年月を選択してください。</strong></div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light"><span>入力</span></div>
        <div className="card-body pb-0">
          <div className="row align-items-end mb-3">
            <div className="col-3">
              <label className="form-label">年月：</label>
              <input
                type="month"
                className="form-control"
                min="2025-04"
                max="2030-03"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="text-end mb-3 col-9">
              <button type="button" className="btn btn-info btn-sm" onClick={() => generateCalendar(selectedMonth)}>表示</button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">祝日データを読み込み中...</p>
        </div>
      ) : (
        calendarDays.length > 0 && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light"><span>カレンダー</span></div>
            <div className="card-body">
              <div className="text-end mb-3">
                <button type="button" className="btn btn-primary btn-sm me-2">保存</button>
                <button type="button" className="btn btn-success btn-sm">申請</button>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center" style={{ width: '60px' }}>日</th>
                      <th className="text-center" style={{ width: '60px' }}>曜日</th>
                      <th style={{ width: '120px' }}>区分</th>
                      <th style={{ width: '160px' }}>開始時刻</th>
                      <th style={{ width: '160px' }}>終了時刻</th>
                      <th style={{ width: '160px' }}>昼休憩時間</th>
                      <th style={{ width: '160px' }}>夜休憩時間</th>
                      <th>備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarDays.map((day) => {
                      let rowClass = "";
                      if (day.isRedDay) {
                        rowClass = "table-danger text-danger";
                      } else if (day.isSaturday) {
                        rowClass = "table-primary text-primary";
                      }

                      return (
                        <tr key={day.dayNumber} className={rowClass}>
                          <td className="text-center fw-bold">{day.dayNumber}</td>
                          <td className="text-center">{day.dayOfWeek}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={day.kbn}
                              onChange={(e) => handleRowChange(day.dayNumber, "kbn", e.target.value)}
                            >
                              <option value="出勤">出勤</option>
                              <option value="公休">公休</option>
                              <option value="有休">有休</option>
                              <option value="欠勤">欠勤</option>
                            </select>
                          </td>
                          <td><input type="time" className="form-control form-control-sm" value={day.startTime} step="900" onChange={(e) => handleRowChange(day.dayNumber, "startTime", e.target.value)} /></td>
                          <td><input type="time" className="form-control form-control-sm" value={day.endTime} step="900" onChange={(e) => handleRowChange(day.dayNumber, "endTime", e.target.value)} /></td>
                          <td><input type="time" className="form-control form-control-sm" value={day.restTime} step="900" onChange={(e) => handleRowChange(day.dayNumber, "restTime", e.target.value)} /></td>
                          <td><input type="time" className="form-control form-control-sm" value={day.nightRestTime} step="900" onChange={(e) => handleRowChange(day.dayNumber, "nightRestTime", e.target.value)} /></td>
                          <td><input type="text" className="form-control form-control-sm" value={day.bikou} onChange={(e) => handleRowChange(day.dayNumber, "bikou", e.target.value)} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
