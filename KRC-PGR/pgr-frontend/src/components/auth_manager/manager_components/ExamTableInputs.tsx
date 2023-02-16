import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { SimpleMyQuestionBean } from "../../../beans/QuestionBean";
import { getLanguageName } from "../../../constants/Language";
import { Row, Col } from "../../global_components/24ColLayout";

function InputTable(props: { questions: Array<SimpleMyQuestionBean>, defaultValues?: Array<{ question_id: string, allocate_score: number }> }) {
    const [values, setValues] = useState<Array<{ question_id: string, allocate_score: number }>>(props.defaultValues === undefined ? [{ question_id: '', allocate_score: 10 }] : props.defaultValues);

    return (
        <>
            <Row>
                <Col offset={18} width={6}>
                    <button type="button" className="btn btn-full" onClick={function () { setValues([...values, { question_id: '', allocate_score: 10 }]); }}>行の追加</button>
                </Col>
            </Row>
            <table className="table" id="input_table">
                <thead>
                    <tr>
                        <th style={{ width: '3em' }}>順番</th>
                        <th style={{ width: '5em' }}>問題番号</th>
                        <th>タイトル</th>
                        <th style={{ width: '5em' }}>投稿日時</th>
                        <th style={{ width: '6em' }}>パスワード</th>
                        <th style={{ width: '8em' }}>他人の解答参考</th>
                        <th style={{ width: '4em' }}>公開</th>
                        <th style={{ width: '5em' }}>採点</th>
                        <th style={{ width: '5em' }}>言語指定</th>
                        <th style={{ width: '5em' }}>配点</th>
                        <th style={{ width: '3em' }}>上に</th>
                        <th style={{ width: '3em' }}>下に</th>
                        <th style={{ width: '3em' }}>削除</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        values.map((row, i) => (
                            <InputTableRow
                                key={i}
                                questions={props.questions}
                                index={i + 1}
                                inputValue={row}
                                onChange_question_id={(val: string) => { values[i].question_id = val; setValues([...values]); }}
                                onChange_allocate_score={(val: number) => { values[i].allocate_score = val; setValues([...values]); }}
                                delFnc={function () { setValues(values.filter((val, j) => i !== j)); }}
                                upFnc={function () { if (i !== 0) { setValues([...swap(values, i, i - 1)]); } }}
                                downFnc={function () { if (i !== (values.length - 1)) { setValues([...swap(values, i, i + 1)]); } }}
                            />
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={8}></td>
                        <td>合計：</td>
                        <td>{values.reduce((acc, value) => acc + value.allocate_score, 0)}</td>
                        <td colSpan={3}></td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}

export default InputTable;

function swap(arr: Array<{ question_id: string, allocate_score: number }>, indexA: number, indexB: number) {
    const tmp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = tmp;
    return arr;
}

function InputTableRow(props: { questions: Array<SimpleMyQuestionBean>, index: number, inputValue: { question_id: string, allocate_score: number }, onChange_question_id: (val: string) => void, onChange_allocate_score: (val: number) => void, delFnc: () => void, upFnc: () => void, downFnc: () => void }) {
    const [question, setQuestion] = useState<SimpleMyQuestionBean>();
    const [question_id, setQuestion_id] = useState(props.inputValue.question_id);
    const [allocate_score, setAllocate_score] = useState(props.inputValue.allocate_score);


    useEffect(() => {
        setQuestion_id(props.inputValue.question_id);
        setAllocate_score(props.inputValue.allocate_score);
    }, [props.inputValue]);

    useEffect(() => {
        if (question_id === '') {
            setQuestion(undefined);
        } else {
            setQuestion(props.questions.find(q => q.question_id === Number(question_id)));
        }
    }, [question_id, props.questions]);

    return (
        <tr data-error-flag={question === undefined}>
            <th>{props.index}</th>
            <td>
                <input type="text" name="question_id" value={question_id} onChange={function (event) {
                    props.onChange_question_id(event.target.value);
                    setQuestion_id(event.target.value);
                }} />
            </td>
            {question === undefined ? (
                <td colSpan={7}><p className="error-message">入力値エラーです。<br />正しい問題番号を入力してください。</p></td>
            ) : (
                <>
                    <td>{question.question_title}</td>
                    <td>{question.insert_datetime}</td>
                    <td data-warning-flag={question.password_required === false}>{question.password_required === true ? '必須' : <p className="error-message">不要</p>}</td>
                    <td data-warning-flag={question.private_answer_mode === false}>{question.private_answer_mode === true ? '参考不可' : <p className="error-message">参考可</p>}</td>
                    <td data-warning-flag={question.release_flag === true}>{question.release_flag === true ? <p className="error-message">公開</p> : '非公開'}</td>
                    <td>{question.scoring === true ? '採点あり' : '採点なし'}</td>
                    <td>{question.language_designation === null ? '指定なし' : getLanguageName(question.language_designation)}</td>
                </>
            )}
            <td>
                <input type="number" name="allocate_score" min={0} value={allocate_score} onChange={function (event) {
                    props.onChange_allocate_score(Number(event.target.value));
                    setAllocate_score(Number(event.target.value));
                }} />
            </td>
            <th onClick={props.upFnc}><FaArrowUp /></th>
            <th onClick={props.downFnc}><FaArrowDown /></th>
            <th onClick={props.delFnc}><ImCross /></th>
        </tr >
    );
}