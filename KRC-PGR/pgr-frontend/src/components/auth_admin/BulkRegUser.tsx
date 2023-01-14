import { AnyFormEvent } from "../../constants/AnyFormEvent";
import * as xlsx from "xlsx";
import { useState } from "react";
import { searchAuthority } from "../../constants/Authority";

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

        for (let i = 2; true/* 内部でbreak判定 */; i++) {
            if (ws[`A${i}`] === undefined) {
                /**
                 * A列(ユーザID)が未入力の時点で以降を無視。
                 * 未入力はundefinedで判定可能。
                 */
                break;
            }

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

    return (
        <>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
            }}>
                <h2>ユーザ一括登録</h2>
                <input type="file" accept=".xls, .xlsx" name="excel_file" onChange={(event) => { readExcelFile(event, setUsers); }} />

                <table>
                    <thead>
                        <tr>
                            <th>
                                ユーザID
                            </th>
                            <th>
                                ユーザ名
                            </th>
                            <th>
                                表示名
                            </th>
                            <th>
                                パスワード
                            </th>
                            <th>
                                権限ID
                            </th>
                            <th>
                                権限名
                            </th>
                            <th>
                                クラスID
                            </th>
                            <th>
                                出席番号
                            </th>
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
                                                <input type="text" defaultValue={row.user_id} />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.user_name} />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.view_name} />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.password} />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.authority_id} />
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
                                                <input type="text" defaultValue={row.class_id} />
                                            </td>
                                            <td>
                                                <input type="text" defaultValue={row.student_number} />
                                            </td>
                                        </tr>
                                    );
                                });
                                return list;
                            }()
                        }
                    </tbody>
                </table>
            </form>
        </>
    );
}

export default BulkRegUser;