import React, { useState, useEffect } from 'react';

// 親から「selectedEmployee（選択された社員データ）」を受け取れるように引数に足します
const EmployeeModals = ({ selectedEmployee, onRefreshList }) => {

    // ==========================================
    // 1. 新規登録モーダル用の State
    // ==========================================
    const [num, setNum] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [lastPass, setLastPass] = useState('');
    const [roleCd, setroleCd] = useState('');
    const [registerErrors, setRegisterErrors] = useState([]);

    // ==========================================
    // 2. 更新モーダル用の State
    // ==========================================
    const [updateName, setUpdateName] = useState('');
    const [updateMail, setUpdateMail] = useState('');
    const [updateDate, setUpdateDate] = useState('');
    const [updateRoleCd, setUpdateRoleCd] = useState('');
    const [updatePass, setUpdatePass] = useState('');
    const [updateConfirmPass, setUpdateConfirmPass] = useState('');
    const [updateErrors, setUpdateErrors] = useState([]);

    // ラジオボタンで選ばれた人が変わったら、自動的に更新欄にその人のデータをセットする仕組み
    useEffect(() => {
        if (selectedEmployee) {
            setUpdateName(selectedEmployee.employeeName || '');
            setUpdateMail(selectedEmployee.email || '');
            setUpdateDate(selectedEmployee.startDate || '');
            setUpdateRoleCd(selectedEmployee.roleCd || '');
        }
    }, [selectedEmployee]);

    // ==========================================
    // 各ボタンが押された時の処理
    // ==========================================
    // 新規登録
    const handleRegister = async () => {
        // 💡 処理開始時に以前のエラー表示をクリア
        setRegisterErrors([]);

        if (pass !== lastPass) {
            // 💡 更新時とUXを統一するため、アラートエリアに表示します
            setRegisterErrors(["パスワードと確認用パスワードが一致しません"]);
            return;
        }

        try {
            const form = {
                employeeNo: num,
                employeeName: name,
                email: mail,
                startDate: date,
                password: pass,
                roleCd: roleCd
            };

            const option = {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            };

            const response = await fetch("/api/employee/create", option);

            if (response.ok) {
                alert("社員データを登録しました");

                // モーダルを閉じる処理
                const modalEl = document.getElementById('sinki-modal');
                const modal = window.bootstrap?.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                // 入力欄をクリア
                setNum(''); setName(''); setDate(''); setMail(''); setPass(''); setLastPass(''); setroleCd('');

                //親コンポーネントの一覧をリフレッシュして、登録した社員番号で自動検索をかける
                if (onRefreshList) onRefreshList(num);
            } else {
                // 💡 Javaの BindingResult から返ってきたエラーメッセージ配列を取得
                const resData = await response.json();
                if (Array.isArray(resData)) {
                    setRegisterErrors(resData); // 配列ごとStateに格納
                } else {
                    setRegisterErrors(["登録に失敗しました"]);
                }
            }
        } catch (err) {
            console.error("登録通信エラー", err);
            setRegisterErrors(["通信エラーが発生しました"]);
        }
    };


    // 更新処理
    const handleUpdate = async () => {
        // 💡 処理開始時に以前のエラー表示をクリア
        setUpdateErrors([]);

        if (updatePass !== updateConfirmPass) {
            setUpdateErrors(["パスワードと確認用パスワードが一致しません"]);
            return;
        }

        try {
            const form = {
                employeeNo: selectedEmployee?.employeeNo,
                employeeName: updateName,
                email: updateMail,
                startDate: updateDate,
                password: updatePass,
                roleCd: updateRoleCd
            };

            const option = {
                method: "PATCH",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            };

            const response = await fetch("/api/employee/update", option);
            if (response.ok) {
                alert("社員情報を更新しました");
                const modalEl = document.getElementById('kousin-modal');
                const modal = window.bootstrap?.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                setUpdatePass('');
                setUpdateConfirmPass('');
                if (onRefreshList) onRefreshList(selectedEmployee?.employeeNo);
            } else {
                // 💡 Javaの BindingResult から返ってきたエラーメッセージ配列を取得
                const resData = await response.json();
                if (Array.isArray(resData)) {
                    setUpdateErrors(resData); // 配列ごとStateに格納
                } else {
                    setUpdateErrors(["更新に失敗しました"]);
                }
            }
        } catch (err) {
            console.error("更新通信エラー", err);
            setUpdateErrors(["通信エラーが発生しました"]);
        }
    };

    // 削除処理
    const handleDelete = async () => {
        try {
            const option = {
                method: "DELETE",
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
            };
            const response = await fetch(`/api/employee/delete/${selectedEmployee?.employeeNo}`, option);
            if (response.ok) {
                alert("社員を削除しました");
                if (onRefreshList) onRefreshList(""); // 全件再取得
            } else {
                alert("削除に失敗しました");
            }
        } catch (err) {
            console.error("削除通信エラー", err);
        }
    };

    return (
        <>
            {/* 新規登録モーダル id="sinki-modal" */}
            <div className="modal fade" id="sinki-modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title">社員登録</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card shadow-sm">
                                <div className="card-header bg-light"><span>社員情報</span></div>

                                {registerErrors.length > 0 && (
                                    <div className="alert alert-danger mx-3 mt-3 mb-0 py-2 px-3">
                                        <ul className="mb-0 ps-3">
                                            {registerErrors.map((msg, idx) => (
                                                <li key={idx}>{msg}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="card-body">
                                    <div className="row g-3 align-items-end">
                                        <div className="col-3">
                                            <label className="form-label">社員番号:</label>
                                            <input type="text" className="form-control" value={num} onChange={(e) => setNum(e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">社員名:</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="col-3">
                                            <label className="form-label">入社日:</label>
                                            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                                        </div>
                                        <div className="col-2">
                                            <label className="form-label">権限:</label>
                                            <select
                                                className="form-control"
                                                value={roleCd}
                                                onChange={(e) => setroleCd(e.target.value)}
                                            >
                                                <option value=""></option>
                                                <option value="1">管理者</option>
                                                <option value="0">一般</option>
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">メールアドレス:</label>
                                            <input type="text" className="form-control" value={mail} onChange={(e) => setMail(e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">パスワード:</label>
                                            <input type="password" className="form-control" value={pass} onChange={(e) => setPass(e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">確認用パスワード:</label>
                                            <input type="password" className="form-control" value={lastPass} onChange={(e) => setLastPass(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" className="btn btn-success" onClick={handleRegister}>登録</button>
                        </div>
                    </div>
                </div>
            </div>


            {/*  更新モーダル id="kousin-modal" */}
            <div className="modal fade" id="kousin-modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title">社員情報更新</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {updateErrors.length > 0 && (
                            <div className="alert alert-danger mx-3 mt-3 mb-0 py-2 px-3">
                                <ul className="mb-0 ps-3">
                                    {updateErrors.map((msg, idx) => (
                                        <li key={idx}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="modal-body">
                            <div className="card shadow-sm">
                                <div className="card-header bg-light">
                                    <span>社員情報</span>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-end">
                                        <div className="col-3">
                                            <label className="form-label">社員番号:</label>
                                            <input type="text" className="form-control" value={selectedEmployee?.employeeNo || ''} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">社員名:</label>
                                            <input type="text" className="form-control" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
                                        </div>
                                        <div className="col-3">
                                            <label className="form-label">入社日:</label>
                                            <input type="date" className="form-control" value={updateDate} onChange={(e) => setUpdateDate(e.target.value)} />
                                        </div>
                                        <div className="col-2">
                                            <label className="form-label">権限:</label>
                                            <select className="form-control" value={updateRoleCd} onChange={(e) => setUpdateRoleCd(e.target.value)}>
                                                <option value=""></option>
                                                <option value="1">管理者</option>
                                                <option value="0">一般</option>
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">メールアドレス:</label>
                                            <input type="text" className="form-control" value={updateMail} onChange={(e) => setUpdateMail(e.target.value)} disabled />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">パスワード:</label>
                                            <input type="password" className="form-control" value={updatePass} onChange={(e) => setUpdatePass(e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">確認用パスワード:</label>
                                            <input type="password" className="form-control" value={updateConfirmPass} onChange={(e) => setUpdateConfirmPass(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>更新</button>
                        </div>
                    </div>
                </div>
            </div>


            {/*  削除モーダル  */}
            <div className="modal fade" id="sakuzyo-modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title">社員削除</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body py-4">
                            <p>選択した社員を削除しますか？</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">削除</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeModals;
