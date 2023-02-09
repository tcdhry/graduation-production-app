import axios from "axios";
import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ClassBean } from "../../beans/ClassBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { ResponseBase, receiveResponse, catchError } from "../../constants/ResponseStatus";
import { generateAPI, API } from "../../constants/URL";
import { Row, Col } from "../global_components/24ColLayout";

function getClassesComposition(navigate: NavigateFunction, setClasses: React.Dispatch<React.SetStateAction<ClassBean[] | undefined>>) {
    type GetClassesCompositionResponse = ResponseBase & {
        data: {
            classes: Array<ClassBean>
        }
    };
    axios.get(generateAPI(API.Admin._, API.Admin.getClassesComposition)).then((res: GetClassesCompositionResponse) => {
        receiveResponse(res, navigate, function () {
            setClasses(res.data.classes);
        });
    }).catch(catchError);
}
function UpdateClass() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Array<ClassBean>>();
    useEffect(() => {
        getClassesComposition(navigate, setClasses);
    }, [navigate]);

    if (classes === undefined) {
        return null;
    }

    return (
        <>
            <h3>分類一覧</h3>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                type NewFaculty = {
                    faculty_id: number,
                    new_faculty_name: string
                };
                const new_faculties: Array<NewFaculty> = [];

                const tr_list: Array<HTMLTableRowElement> = Array.from(event.target.querySelectorAll('tr'));
                for (let i = 1; i < tr_list.length; i++) {
                    const tr = tr_list[i];
                    const faculty_id = Number(tr.querySelector('th')?.innerText);
                    const new_faculty_name = tr.querySelector('input')!.value;
                    new_faculties.push({ faculty_id: faculty_id, new_faculty_name: new_faculty_name });
                }

                if (hasDupicate(new_faculties, (row: NewFaculty) => row.new_faculty_name) === true) {
                    alert('分類名に重複があります。');
                    return;
                }

                if (window.confirm('分類マスタを更新しますか？') === false) {
                    return;
                }

                type UpdateFacultiesResponse = ResponseBase & {
                    data: {
                        success: boolean
                    }
                };
                axios.post(generateAPI(API.Admin._, API.Admin.updateFaculties), { new_faculties: new_faculties }).then((res: UpdateFacultiesResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            alert('更新完了');
                            getClassesComposition(navigate, setClasses);
                        } else {
                            alert('更新に失敗しました。');
                        }
                    });
                }).catch(catchError);
            }}>
                <Row>
                    <Col>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '6em' }}>分類番号</th>
                                    <th>分類名</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classes.reduce((acc: Array<ClassBean>, current) => {
                                        if (!acc.some(cls => cls.faculty_id === current.faculty_id)) {
                                            acc.push(current);
                                        }
                                        return acc;
                                    }, []).map((cls, i) => {
                                        return (
                                            <tr key={i}>
                                                <th>{cls.faculty_id}</th>
                                                <td><input type="text" defaultValue={cls.faculty_name!} /></td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input type="submit" value="更新する" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
            <br />

            <h3>学科一覧</h3>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();

                if (event.target.querySelector('tr[data-error-flag="true"]')) {
                    alert('不正な分類番号が指定されています。存在する番号を入力してください。');
                    return;
                }

                type NewDepartment = {
                    department_id: number,
                    new_department_name: string,
                    new_faculty_id: number
                };
                const new_departments: Array<NewDepartment> = [];

                const tr_list: Array<HTMLTableRowElement> = Array.from(event.target.querySelectorAll('tr'));
                for (let i = 1; i < tr_list.length; i++) {
                    const tr = tr_list[i];
                    const department_id = Number(tr.querySelector('th')?.innerText);
                    const inputs = tr.querySelectorAll('input');
                    const new_department_name = inputs[0].value;
                    const new_faculty_id = Number(inputs[1].value);
                    new_departments.push({ department_id: department_id, new_department_name: new_department_name, new_faculty_id: new_faculty_id });
                }

                if (hasDupicate(new_departments, (row: NewDepartment) => row.new_department_name) === true) {
                    alert('学科名に重複があります。');
                    return;
                }

                if (window.confirm('学科マスタを更新しますか？') === false) {
                    return;
                }

                type UpdateDepartmentsResponse = ResponseBase & {
                    data: {
                        success: boolean
                    }
                };
                axios.post(generateAPI(API.Admin._, API.Admin.updateDepartments), { new_departments: new_departments }).then((res: UpdateDepartmentsResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            alert('更新完了');
                            getClassesComposition(navigate, setClasses);
                        } else {
                            alert('更新に失敗しました。');
                        }
                    });
                }).catch(catchError);
            }}>
                <Row>
                    <Col>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '6em' }}>学科番号</th>
                                    <th style={{ width: '20em' }}>学科名</th>
                                    <th style={{ width: '6em' }}>分類番号</th>
                                    <th>分類名</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classes.reduce((acc: Array<ClassBean>, current) => {
                                        if (!acc.some(cls => cls.department_id === current.department_id) && current.department_id !== null) {
                                            acc.push(current);
                                        }
                                        return acc;
                                    }, []).map((cls, i) => {
                                        return (
                                            <DepartmentsRow key={i} cls={cls} classes={classes} />
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input type="submit" value="更新する" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
            <br />

            <h3>クラス一覧</h3>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();

                if (event.target.querySelector('tr[data-error-flag="true"]')) {
                    alert('不正な学科番号が指定されています。存在する番号を入力してください。');
                    return;
                }

                type NewClass = {
                    class_id: number
                    new_class_name: string,
                    new_department_id: number,
                };
                const new_classes: Array<NewClass> = [];

                const tr_list: Array<HTMLTableRowElement> = Array.from(event.target.querySelectorAll('tr'));
                for (let i = 1; i < tr_list.length; i++) {
                    const tr = tr_list[i];
                    const class_id = Number(tr.querySelector('th')?.innerText);
                    const inputs = tr.querySelectorAll('input');
                    const new_class_name = inputs[0].value;
                    const new_department_id = Number(inputs[1].value);
                    new_classes.push({ class_id: class_id, new_class_name: new_class_name, new_department_id: new_department_id });
                }

                if (hasDupicate(new_classes, (row: NewClass) => row.new_class_name) === true) {
                    alert('クラス名に重複があります。');
                    return;
                }

                if (window.confirm('クラスマスタを更新しますか？') === false) {
                    return;
                }

                type UpdateClassesResponse = ResponseBase & {
                    data: {
                        success: boolean
                    }
                };
                axios.post(generateAPI(API.Admin._, API.Admin.updateClasses), { new_classes: new_classes }).then((res: UpdateClassesResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            alert('更新完了');
                            getClassesComposition(navigate, setClasses);
                        } else {
                            alert('更新に失敗しました。');
                        }
                    });
                }).catch(catchError);
            }}>
                <Row>
                    <Col>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '6em' }}>クラス番号</th>
                                    <th style={{ width: '10em' }}>クラス名</th>
                                    <th style={{ width: '6em' }}>学科番号</th>
                                    <th>学科名</th>
                                    <th style={{ width: '7em' }}>分類番号</th>
                                    <th style={{ width: '10em' }}>分類名</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classes.reduce((acc: Array<ClassBean>, current) => {
                                        if (!acc.some(cls => cls.class_id === current.class_id) && current.class_id !== null) {
                                            acc.push(current);
                                        }
                                        return acc;
                                    }, []).map((cls, i) => {
                                        return (
                                            <ClassesRow key={i} cls={cls} classes={classes} />
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button type="button" className="btn btn-full" onClick={function (event) {
                            const form = event.currentTarget.form!;
                            const input_list: Array<HTMLInputElement> = Array.from(form.querySelectorAll('input[data-cname-input]'));
                            const class_names = input_list.map(input => input.value);
                            const sotsu = '(' + new Date().getFullYear().toString().slice(-2) + '卒)';

                            input_list.forEach((input) => {
                                const val = input.value;

                                if (/^[0-9][A-Z]$/.test(val)) {
                                    // {数}{英大文字}の形式に当てはまる場合のみ処理する。
                                    const n = Number(val.charAt(0));
                                    const a = val.charAt(1);
                                    const newName = (n + 1) + a;
                                    if (class_names.includes(newName)) {
                                        input.value = newName;
                                    } else {
                                        input.value = val + sotsu;
                                    }
                                }
                            });


                        }}>進級後のクラスを自動で入力</button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <input type="submit" value="更新する" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}

export default UpdateClass;

function DepartmentsRow(props: { cls: ClassBean, classes: Array<ClassBean> }) {
    const [selectFaculty_id, setSelectFaculty_id] = useState<string | undefined>(String(props.cls.faculty_id));
    const [selectFaculty, setSelectFaculty] = useState<ClassBean | undefined>(props.cls);

    useEffect(() => {
        if (selectFaculty_id === '') {
            // Number() で0になるため弾く
            setSelectFaculty(undefined);
        } else {
            setSelectFaculty(props.classes.find(cls => String(cls.faculty_id) === selectFaculty_id));
        }
    }, [props.classes, selectFaculty_id]);

    return (
        <>
            <tr data-error-flag={selectFaculty === undefined}>
                <th>{props.cls.department_id}</th>
                <td>
                    <input type="text" defaultValue={props.cls.department_name!} />
                </td>
                <td>
                    <input type="text" defaultValue={props.cls.faculty_id!}
                        onChange={function (event) {
                            setSelectFaculty_id(event.target.value);
                        }}
                    />
                </td>
                <td>{selectFaculty === undefined ? '入力値エラー' : selectFaculty?.faculty_name}</td>
            </tr>
        </>
    );
}

function ClassesRow(props: { cls: ClassBean, classes: Array<ClassBean> }) {
    const [selectDepartment_id, setSelectDepartment_id] = useState<string | undefined>(String(props.cls.department_id));
    const [selectDepartment, setSelectDepartment] = useState<ClassBean | undefined>(props.cls);

    useEffect(() => {
        if (selectDepartment_id === '') {
            // Number() で0になるため弾く
            setSelectDepartment(undefined);
        } else {
            setSelectDepartment(props.classes.find(cls => String(cls.department_id) === selectDepartment_id));
        }
    }, [props.classes, selectDepartment_id]);
    return (
        <>
            <tr data-error-flag={selectDepartment === undefined}>
                <th>{props.cls.class_id}</th>
                <td><input type="text" defaultValue={props.cls.class_name!} data-cname-input /></td>
                <td>
                    <input type="text" defaultValue={props.cls.department_id!}
                        onChange={function (event) {
                            setSelectDepartment_id(event.target.value);
                        }}
                    />
                </td>
                <td>{selectDepartment === undefined ? '入力値エラー' : selectDepartment?.department_name}</td>
                <th>{selectDepartment === undefined ? '入力値エラー' : selectDepartment?.faculty_id}</th>
                <td>{selectDepartment === undefined ? '入力値エラー' : selectDepartment?.faculty_name}</td>
            </tr>
        </>
    );
}

function hasDupicate(arr: Array<any>, get: (row: any) => string) {
    for (let i = 0; i < arr.length; i++) {
        const ele = get(arr[i]);
        for (let j = i + 1; j < arr.length; j++) {
            if (get(arr[j]) === ele) {
                return true;
            }
        }
    }
    return false;
}