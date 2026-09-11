import { useState, useEffect } from "react";
import EmployeeModals from './EmployeeModals.jsx';

export default function EmployeeMaster() {

  // --------------------------------------------------
  // ステート置き場
  // --------------------------------------------------
  const [employeeList, setEmployeeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号初期値１
  const itemsPerPage = 5; // 1ページあたりの表示件数を5件に

  // エラーを管理する箱
  const [errors, setErrors] = useState({});

  //検索条件を入力欄と連動させるためのステート
  const [searchNum, setSearchNum] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchMail, setSearchMail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchRole, setSearchRole] = useState("");

  // ラジオボタンで選ばれた社員を管理するステート
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  // --------------------------------------------------
  // 通信・イベント処理
  // --------------------------------------------------

  // 初期表示時にAPIを呼び出す
  useEffect(() => {
    getEmployeeList();
  }, []);

  const getEmployeeList = async (targetNum = "") => {
    try {
      // 検索を始める前に、前回のエラーや警告を一度リセットする
      setErrors({});
      const alertPlaceholder = document.getElementById("search-alert-placeholder");
      if (alertPlaceholder) alertPlaceholder.style.display = "none";

      const numParam = targetNum || searchNum;
      const option = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // クエリパラメータ（URLの後ろにつける検索条件）を組み立てる
      const query = new URLSearchParams({
        employeeNo: numParam,
        employeeName: searchName,
        email: searchMail,
        startDate: searchDate,
        roleCd: searchRole
      }).toString();

      // REST API呼び出し
      const response = await fetch(`/api/employee/index?${query}`, option);

      // ステータスチェックの条件分岐
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        setEmployeeList(json || []);
        setCurrentPage(1); // 検索したときは1ページ目に戻す

        // 新しく取得した一覧データから、自動選択された社員の最新データを探して上書きする
        if (json && json.length > 0 && targetNum) {
          // 新しく取得したリストの中から、新しく登録した社員番号の人を探す
          const latestData = json.find(e => e.employeeNo === targetNum);

          if (latestData) {
            // 見つかったら、その本当に最新のデータで選択状態を上書きする
            setSelectedEmployee(latestData);
          }
        }

        // 検索結果が0件だった場合は警告を出す
        if (!json || json.length === 0) {
          if (alertPlaceholder) alertPlaceholder.style.display = "block";
        }
      } else if (response.status === 400) {
        //バリデーションエラーが発生した場合
        const errorJson = await response.json();
        setErrors(errorJson); // エラーの箱に入れる
      } else {
        alert("検索処理に失敗しました");
      }

    } catch (err) {
      console.error("検索通信エラー", err);
    }
  };

  // 検索ボタンを押したとき
  const handleSearch = () => {
    getEmployeeList();
  };

  // クリアボタンを押したとき
  const handleClear = () => {
    setSearchNum("");
    setSearchName("");
    setSearchMail("");
    setSearchDate("");
    setSearchRole("");
    setErrors({});
    setCurrentPage(1);
  };


  // --------------------------------------------------
  // ページネーション
  // --------------------------------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employeeList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employeeList.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mt-4">
      <h2>社員マスタ管理</h2>

      {/* エラー表示エリア */}
      <div id="search-alert-placeholder" className="mb-3" style={{ display: "none" }}>
        <div className="alert alert-warning py-2 px-3 m-0" role="alert">
          <strong>検索結果がありませんでした。</strong>
        </div>
      </div>

      {/* <!--検索条件カード--> */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <span>検索条件</span>
        </div>
        <div className="card-body pb-0">
          <div className="row align-items-end mb-3">
            <div className="col-2">
              <label htmlFor="searchNum" className="form-label">社員番号:</label>
              <input type="text" className="form-control" id="searchNum" name="searchNum"
                value={searchNum} onChange={(e) => setSearchNum(e.target.value)} />
            </div>

            <div className="col-3">
              <label htmlFor="searchName" className="form-label">社員名:</label>
              <input type="text" className="form-control" id="searchName" name="searchName"
                value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </div>

            <div className="col-3">
              <label htmlFor="searchMail" className="form-label">メールアドレス:</label>
              <input type="text" className="form-control" id="searchMail" name="searchMail"
                value={searchMail} onChange={(e) => setSearchMail(e.target.value)} />
            </div>

            <div className="col-2">
              <label htmlFor="searchDate" className="form-label">入社日：</label>
              <input type="date" id="searchDate" name="searchDate" className="form-control" min="2025-04" max="2030-03"
                value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            </div>
            <div className="col-2">
              <label htmlFor="searchRole" className="form-label">権限：</label>
              <select id="searchRole" name="searchRole" className="form-select"
                value={searchRole} onChange={(e) => setSearchRole(e.target.value)} >
                <option value=""></option>
                <option value="0">一般</option>
                <option value="1">管理者</option>
              </select>
            </div>
          </div>

          <div className="text-end mb-3">
            <button type="button" className="btn btn-warning btn-sm me-2" name="clear-btn" onClick={handleClear}>クリア</button>
            <button
              type="button"
              className="btn btn-info btn-sm"
              name="kensaku-btn"
              onClick={handleSearch}
            >
              検索
            </button>
          </div>
        </div>
      </div>

      {/* <!--検索結果コンテナ--> */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <span>検索結果</span>
        </div>
        <div className="card-body">
          <div className="text-end mb-3">
            <button type="button" className="btn btn-success btn-sm me-2"
              data-bs-toggle="modal" data-bs-target="#sinki-modal" name="sinki">新規</button>
            <button type="button" className="btn btn-primary btn-sm me-2"
              data-bs-toggle="modal" data-bs-target="#kousin-modal" name="kousin" disabled={!selectedEmployee}>更新</button>
            <button type="button" className="btn btn-danger btn-sm"
              data-bs-toggle="modal" data-bs-target="#sakuzyo-modal" name="sakuzyo" disabled={!selectedEmployee}>削除</button>
          </div>

          {/* <!--テーブルエリア--> */}
          <div className="table-responsive">
            <table className="table mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">社員番号</th>
                  <th scope="col">社員名</th>
                  <th scope="col">メールアドレス</th>
                  <th scope="col">入社日</th>
                  <th scope="col">権限</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((emp, index) => (
                  <tr key={emp.employeeNo || index}>
                    <td>
                      <input
                        type="radio"
                        name="employee-select"
                        value={emp.employeeNo || ""}
                        checked={selectedEmployee?.employeeNo === emp.employeeNo}
                        onChange={() => setSelectedEmployee(emp)}
                      />
                    </td>
                    <td>{emp.employeeNo}</td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.startDate}</td>
                    <td>{emp.roleName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          <nav className="mt-3">
            <ul className="pagination justify-content-center mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)} type="button">前</button>
              </li>
              {[...Array(totalPages || 1)].map((_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => paginate(i + 1)} type="button">{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)} type="button">次</button>
              </li>
            </ul>
          </nav>

        </div>
      </div>
      <EmployeeModals
        selectedEmployee={selectedEmployee}
        onRefreshList={getEmployeeList}
      />
    </div >
  );
}
