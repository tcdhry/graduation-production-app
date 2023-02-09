import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassBean } from "../../beans/ClassBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import { Row, Col } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";

function ClassManage() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Array<ClassBean>>();
    useEffect(() => {
        type GetClassesResponseComposition = ResponseBase & {
            data: {
                classes: Array<ClassBean>
            }
        };
        axios.get(generateAPI(API.Admin._, API.Admin.getClassesComposition)).then((res: GetClassesResponseComposition) => {
            receiveResponse(res, navigate, function () {
                setClasses(res.data.classes);
            });
        }).catch(catchError);
    }, [navigate]);

    const [selectFaculty, setSelectFaculty] = useState<ClassBean>();
    const [selectDepartment, setSelectDepartment] = useState<ClassBean>();

    if (classes === undefined) {
        return null;
    }

    return (
        <>
            <h2>新規クラス</h2>
            <h3>分類一覧</h3>
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
                                        <tr key={i} onClick={(event) => { setSelectFaculty(cls); }}>
                                            <th>{cls.faculty_id}</th>
                                            <td>{cls.faculty_name}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </Col>
            </Row>
            <br />

            <h3>学科一覧</h3>
            <Row>
                <Col>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '6em' }}>学科番号</th>
                                <th>学科名</th>
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
                                        <tr key={i} onClick={(event) => { setSelectDepartment(cls); }}>
                                            <th>{cls.department_id}</th>
                                            <td>{cls.department_name}</td>
                                            <th>{cls.faculty_id}</th>
                                            <td>{cls.faculty_name}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </Col>
            </Row>
            <br />

            <h3>クラス一覧</h3>
            <Row>
                <Col>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '6em' }}>クラス番号</th>
                                <th>クラス名</th>
                                <th style={{ width: '6em' }}>学科番号</th>
                                <th>学科名</th>
                                <th style={{ width: '6em' }}>分類番号</th>
                                <th>分類名</th>
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
                                        <tr key={i}>
                                            <th>{cls.class_id}</th>
                                            <td>{cls.class_name}</td>
                                            <th>{cls.department_id}</th>
                                            <td>{cls.department_name}</td>
                                            <th>{cls.faculty_id}</th>
                                            <td>{cls.faculty_name}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </Col>
            </Row>
            <br />

            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                if (selectFaculty === undefined) {
                    alert('先に学部を選択してください。');
                    return;
                }
                const department_id = Number(event.target.department_id.value);
                const department_name = event.target.department_name.value;

                if (classes.map(cls => cls.department_id).includes(department_id) === true) {
                    alert('既存の学科番号に重複しないでください。');
                    return;
                }
                if (classes.map(cls => cls.department_name).includes(department_name) === true) {
                    alert('既存の学科名に重複しないでください。');
                    return;
                }

                type NewDepartmentResponse = ResponseBase & {
                    data: {
                        success: boolean
                    }
                }
                console.log({
                    faculty_id: selectFaculty.faculty_id,
                    department_id: department_id,
                    department_name: department_name
                });
                axios.post(generateAPI(API.Admin._, API.Admin.newDepartment), {
                    faculty_id: selectFaculty.faculty_id,
                    department_id: department_id,
                    department_name: department_name
                }).then((res: NewDepartmentResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            setClasses([...classes, {
                                class_id: null, class_name: null,
                                department_id: department_id, department_name: department_name,
                                faculty_id: selectFaculty.faculty_id, faculty_name: selectFaculty.faculty_name
                            }]);
                        } else {
                            alert('エラーが発生しました。');
                        }
                    });
                }).catch(catchError);
            }}>
                <h3>新規学科</h3>
                <Row>
                    <Col>
                        <p>①分類一覧の行をクリック</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            分類番号：{selectFaculty?.faculty_id}<br />
                            分類名　：{selectFaculty?.faculty_name}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            ②新規学科の情報を入力（既存の学科に重複しないようにしてください）
                        </p>
                    </Col>
                </Row>
                <LabelInput
                    label={<label htmlFor="department_id">学科番号</label>}
                    input={<input type="number" min={0} id="department_id" />}
                    label_width={5}
                />
                <LabelInput
                    label={<label htmlFor="department_name">学科名</label>}
                    input={<input type="text" id="department_name" />}
                    label_width={5}
                />
                <Row>
                    <Col>
                        <input type="submit" value="追加" className="btn btn-full" />
                    </Col>
                </Row>
            </form>

            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                if (selectDepartment === undefined) {
                    alert('先に学科を選択してください。')
                    return;
                }
                const class_id = Number(event.target.class_id.value);
                const class_name = event.target.class_name.value;

                if (classes.map(cls => cls.class_id).includes(class_id) === true) {
                    alert('既存のクラス番号に重複しないでください。');
                    return;
                }
                if (classes.map(cls => cls.class_name).includes(class_name) === true) {
                    alert('既存のクラス名に重複しないでください。');
                    return;
                }

                type NewClassResponse = ResponseBase & {
                    data: {
                        success: boolean
                    }
                }
                axios.post(generateAPI(API.Admin._, API.Admin.newClass), {
                    department_id: selectDepartment.department_id,
                    class_id: class_id,
                    class_name: class_name
                }).then((res: NewClassResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            setClasses([...classes, {
                                class_id: class_id, class_name: class_name,
                                department_id: selectDepartment.department_id, department_name: selectDepartment.department_name,
                                faculty_id: selectDepartment.faculty_id, faculty_name: selectDepartment.faculty_name
                            }]);
                        } else {
                            alert('エラーが発生しました。');
                        }
                    });
                }).catch(catchError);
            }}>
                <h3>新規クラス</h3>
                <Row>
                    <Col>
                        <p>①学科一覧の行をクリック</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            分類番号：{selectDepartment?.faculty_id}<br />
                            分類名　：{selectDepartment?.faculty_name}<br />
                            学科番号：{selectDepartment?.department_id}<br />
                            学科名　：{selectDepartment?.department_name}
                        </p>
                    </Col>
                </Row>
                <LabelInput
                    label={<label htmlFor="class_id">クラス番号</label>}
                    input={<input type="number" min={0} id="class_id" />}
                    label_width={5}
                />
                <LabelInput
                    label={<label htmlFor="class_name">クラス名</label>}
                    input={<input type="text" id="class_name" />}
                    label_width={5}
                />
                <Row>
                    <Col>
                        <p>
                            ②新規クラスの情報を入力（既存のクラスに重複しないようにしてください）
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input type="submit" value="追加" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}

export default ClassManage;