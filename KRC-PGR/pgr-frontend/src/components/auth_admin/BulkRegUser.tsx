import { AnyFormEvent } from "../../constants/AnyFormEvent";
import * as xlsx from "xlsx";
import { useEffect, useState } from "react";
import { searchAuthority } from "../../constants/Authority";
import axios from "axios";
import { API, generateAPI } from "../../constants/URL";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { useNavigate } from "react-router-dom";
import { ClassBean } from "../../beans/ClassBean";

function getVal(val: any) {
    return val === undefined ? undefined : val.v;
}

function readExcelFile(event: React.ChangeEvent<HTMLInputElement>, setUsers: React.Dispatch<React.SetStateAction<RowData[]>>) {
    if (event.target.files === null || event.target.files.length === 0) {
        return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = xlsx.read(bstr, { type: "binary" });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const list = [];

        for (let i = 2; ws[`A${i}`] !== undefined; i++) {
            const row = {
                user_id: ws[`A${i}`].v,
                user_name: getVal(ws[`B${i}`]),
                view_name: getVal(ws[`C${i}`]),
                password: getVal(ws[`D${i}`]),
                authority_id: getVal(ws[`E${i}`]),
                class_id: getVal(ws[`F${i}`]),
                student_number: getVal(ws[`G${i}`]),
            }
            list.push(row);
        }

        setUsers(list);
        // const data = xlsx.utils.sheet_to_csv(ws, { header: 1 });
        // const data = xlsx.utils.sheet_to_csv(ws);
        // console.log(data);
    };
    reader.readAsBinaryString(file);
}

// function outputTemplateExcelFile() {
//     // const data = [['ユーザID', 'ユーザ名', '表示名', 'パスワード', '権限ID', 'クラスID', '出席番号']];
//     // const headers = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1'];

//     // const wb = new WorkBook();
//     // const sheet = wb.addSheet('Sheet1');

//     // for (let i = 0; i < data.length; i++) {
//     //     for (let j = 0; j < data[i].length; j++) {
//     //         sheet.set(headers[j], i, data[i][j]);
//     //     }
//     // }

//     // wb.download('new-file.xlsx');

//     // // const ws = xlsx.utils.json_to_sheet(data);
//     // // const wb = xlsx.utils.book_new();

//     // // xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
//     // // xlsx.writeFile(wb, 'template.xlsx');
// }

type RowData = {
    user_id: string,
    user_name: string,
    view_name: string,
    password: string,
    authority_id: string,
    class_id: string,
    student_number: string,
};

function BulkRegUser() {
    const [users, setUsers] = useState<Array<RowData>>([]);
    const [classes, setClasses] = useState<Array<ClassBean>>([]);

    const navigate = useNavigate();

    useEffect(() => {
        type GetClassesResponse = ResponseBase & {
            data: {
                classes: Array<ClassBean>
            }
        };
        axios.get(generateAPI(API.Admin._, API.Admin.getClasses)).then((res: GetClassesResponse) => {
            receiveResponse(res, navigate, function () {
                setClasses(res.data.classes);
            });
        }).catch(catchError);
    }, [navigate]);

    return (
        <>
            <h2>ユーザ一括登録</h2>
            <input type="file" accept=".xls, .xlsx" name="excel_file" onChange={(event) => { readExcelFile(event, setUsers); }} />
            {/* <button className="btn btn-full" onClick={outputTemplateExcelFile}>Excelテンプレートファイルをダウンロードする。</button> */}

            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const tr_list = event.target.getElementsByTagName('tr');
                const newUsers: Array<RowData> = [];

                function includesClasses(class_id: string) {
                    classes.forEach((cls) => {
                        if (String(cls.class_id) === class_id) {
                            return true;
                        }
                    });
                    return false;
                }

                [...tr_list].slice(1).forEach((tr: HTMLTableRowElement) => {
                    const user_id = (tr.querySelector('.user_id')! as HTMLInputElement).value;
                    const user_name = (tr.querySelector('.user_name')! as HTMLInputElement).value;
                    const view_name = (tr.querySelector('.view_name')! as HTMLInputElement).value;
                    const password = (tr.querySelector('.password')! as HTMLInputElement).value;
                    const authority_id = (tr.querySelector('.authority_id')! as HTMLInputElement).value;
                    const class_id = (tr.querySelector('.class_id')! as HTMLInputElement).value;
                    const student_number = (tr.querySelector('.student_number')! as HTMLInputElement).value;
                    // console.log(user_id, user_name, view_name, password, authority_id, class_id, student_number);

                    if (!['0', '1', '2'].includes(authority_id)) {
                        // authority_id error
                    }

                    if (!includesClasses(class_id)) {
                        // class_id error
                    }

                    newUsers.push({
                        user_id: user_id,
                        user_name: user_name,
                        view_name: view_name,
                        password: password,
                        authority_id: authority_id,
                        class_id: class_id,
                        student_number: student_number
                    });
                });



                type BulkRegUserResponse = ResponseBase & {
                    data: {

                    }
                };
                axios.post(generateAPI(API.Admin._, API.Admin.bulkRegUser), { newUsers: newUsers }).then((res: BulkRegUserResponse) => {
                    receiveResponse(res, navigate, function () {

                    });
                }).catch(catchError);
            }}>

                <table>
                    <thead>
                        <tr>
                            <th>ユーザID</th><th>ユーザ名</th><th>表示名</th><th>パスワード</th><th>権限ID</th><th>権限名</th><th>クラスID</th><th>出席番号</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            function () {
                                const list: Array<JSX.Element> = [];
                                let i = 0;
                                users.forEach((row) => {
                                    list.push(
                                        <tr key={i++}>
                                            <td>
                                                <input type="text" defaultValue={row.user_id} className="user_id" />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.user_name} className="user_name" />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.view_name} className="view_name" />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.password} className="password" />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.authority_id} className="authority_id" />
                                            </td>
                                            <td>
                                                {function () {
                                                    if (row.authority_id === undefined) {
                                                        return '無入力';
                                                    }
                                                    const tmp = Number(row.authority_id);
                                                    if (isNaN(tmp) === true) {
                                                        return '不正';
                                                    }
                                                    const authority = searchAuthority(tmp);;
                                                    if (authority === undefined) {
                                                        return '未定義';
                                                    }
                                                    return authority.ja;
                                                }()}
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.class_id} className="class_id" />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.student_number} className="student_number" />
                                            </td>
                                        </tr>
                                    );
                                });
                                return list;
                            }()
                        }
                    </tbody>
                </table>

                <input type="submit" value="登録する" className="btn btn-full" />
            </form>
        </>
    );
}

export default BulkRegUser;