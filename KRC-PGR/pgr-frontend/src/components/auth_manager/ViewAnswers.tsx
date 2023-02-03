import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClassBean } from "../../beans/ClassBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { ExecStatusCode, ExecStatuses } from "../../constants/ExecStatus";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import { Row, Col } from "../global_components/24ColLayout";
import LabelInput, { LabelCheckbox, LabelRadio } from "../global_components/LabelInput";
import JSZip from 'jszip';
import { getLanguageName } from "../../constants/Language";
import CodeEditor from "../global_components/CodeEditor";

type AnswerBean = {
    user_id: number,
    user_name: string,
    student_number: number | null,
    class_id: number | null,
    class_name: string | null,
    department_id: number | null,
    department_name: string | null,
    faculty_id: number | null,
    faculty_name: string | null,
    select_language: number,
    rows_count: number,
    chars_count: number,
    insert_timestamp: string,
    exec_count: number,
    accepted_count: number,
    exec_statuses: Array<ExecStatusCode>,
    exec_times: Array<number>
};

function ViewAnswers() {
    const question_id = useParams().question_id;
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Array<AnswerBean>>([]);
    const [errorFlag, setErrorFlag] = useState<boolean>();
    const [question_title, setQuestion_title] = useState<string>();
    const [input_judge, setInput_judge] = useState<Array<string> | null>(null);
    const [output_judge, setOutput_judge] = useState<Array<string> | null>(null);
    const [classes, setClasses] = useState<Array<ClassBean>>([]);
    const [departments, setDepartments] = useState<Array<ClassBean>>([]);
    const [faculties, setFaculties] = useState<Array<ClassBean>>([]);

    useEffect(() => {
        type ViewAnswersResponse = ResponseBase & {
            data: {
                errorFlag: boolean,
                question_title: string,
                input_judge: Array<string>,
                output_judge: Array<string>,
                answers: Array<AnswerBean>
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.viewAnswers) + '/' + question_id).then((res: ViewAnswersResponse) => {
            receiveResponse(res, navigate, function () {
                setErrorFlag(res.data.errorFlag);
                setAnswers(res.data.answers);
                setQuestion_title(res.data.question_title);
                setInput_judge(res.data.input_judge);
                setOutput_judge(res.data.output_judge);
            });
        }).catch(catchError);
    }, [navigate, question_id]);

    useEffect(() => {
        /**
         * ここの処理はやろうと思えば
         * AnswersTableのループ内で同時進行で処理することもできるが、
         * 引数が6つ増え、コンポーネント単体での独立性が薄れるためここに切り出す。
         */
        const new_classes: Array<ClassBean> = [];
        const new_departments: Array<ClassBean> = [];
        const new_faculties: Array<ClassBean> = [];
        answers.forEach((answer) => {
            if (!new_classes.map((cls) => cls.class_id).includes(answer.class_id)) {
                const new_class = { class_id: answer.class_id, class_name: answer.class_name, department_id: answer.department_id, department_name: answer.department_name, faculty_id: answer.faculty_id, faculty_name: answer.faculty_name };
                new_classes.push(new_class);
                if (!new_departments.map((dep) => dep.department_id).includes(answer.department_id)) {
                    new_departments.push(new_class);
                    if (!new_faculties.map((fac) => fac.faculty_id).includes(answer.faculty_id)) {
                        new_faculties.push(new_class);
                    }
                }
            }
        });
        setClasses(new_classes);
        setDepartments(new_departments);
        setFaculties(new_faculties);
    }, [answers]);

    if (answers === undefined) {
        return (
            null
        );
    }

    return (
        <div id="view-answers">
            <h2>提出された解答一覧</h2>
            {errorFlag === true ? (
                <p>存在しない問題か、あなたが投稿した問題ではありません。</p>
            ) : (
                null
            )}
            <p>

                問題番号：{question_id}<br />
                タイトル：{question_title}<br />
            </p>
            {answers === null ? (
                null
            ) : (
                <>
                    <form onSubmit={function (event: AnyFormEvent) {
                        event.preventDefault();
                        const dl_users = (Array.from(event.target.user_id) as Array<HTMLInputElement>)
                            .filter(checkbox => checkbox.checked === true)
                            .map(checkbox => Number(checkbox.value));

                        const zip_format = Number(event.target.zip_format.value);

                        type DownloadAnswersResponse = ResponseBase & {
                            data: {
                                errorFlag: boolean,
                                answers: Array<{
                                    user_id: number,
                                    user_name: string,
                                    student_number: number | null,
                                    class_id: number | null,
                                    class_name: string | null,
                                    department_id: number | null,
                                    department_name: string | null,
                                    faculty_id: number | null,
                                    faculty_name: string | null,
                                    source_code: string,
                                    file_name: string,
                                    outputs: Array<{
                                        output: string
                                    }>
                                }>
                            }
                        }
                        axios.post(generateAPI(API.Manager._, API.Manager.downloadAnswers) + '/' + question_id, { dl_users: dl_users }).then((res: DownloadAnswersResponse) => {
                            receiveResponse(res, navigate, function () {
                                if (res.data.errorFlag === true) {
                                    alert('処理エラー');
                                    return;
                                }
                                const answers = res.data.answers;
                                const zip = new JSZip();

                                answers.forEach((answer) => {
                                    const path = formats(zip_format, answer.user_id, answer.user_name, answer.student_number, answer.class_id, answer.class_name, answer.department_id, answer.department_name, answer.faculty_id, answer.faculty_name, answer.file_name);
                                    zip.file(path, answer.source_code);
                                    answer.outputs.forEach((output, i) => {
                                        const outputPath = formats(zip_format, answer.user_id, answer.user_name, answer.student_number, answer.class_id, answer.class_name, answer.department_id, answer.department_name, answer.faculty_id, answer.faculty_name, `output${i}.txt`);
                                        zip.file(outputPath, output.output);
                                    })
                                });

                                zip.generateAsync({ type: "blob" }).then(function (content) {
                                    const link = document.createElement('a');
                                    link.href = window.URL.createObjectURL(content);
                                    link.download = 'example.zip';
                                    link.click();
                                });
                            });
                        }).catch(catchError);
                    }}>
                        <AnswersTable answers={answers} question_id={question_id as string} input_judge={input_judge} output_judge={output_judge} />
                        <hr />
                        <SpreadSheet answers={answers} />
                        <hr />
                        <h3>ダウンロード対象の絞り込み</h3>
                        <Row>
                            <Col width={11}>
                                <h4>学科</h4>
                                <table>
                                    <tbody>
                                        {departments.sort((a, b) => String(a.class_name).localeCompare(String(b.class_name))).map((cls, i) =>
                                            <tr key={i}>
                                                <td>
                                                    <LabelCheckbox
                                                        value={String(cls.department_id)}
                                                        id={'department-' + String(cls.department_id)}
                                                        name="select-department"
                                                        labelText={cls.class_id === null ? 'その他' : `${cls.faculty_name} ${cls.department_name}`}
                                                        defaultChecked={true}
                                                        onChange={function (event) {
                                                            Array.from(document.querySelectorAll(`input[data-d="${cls.department_id}"]`)).forEach((checkbox) => { (checkbox as HTMLInputElement).checked = event.target.checked; })
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <h4>分類</h4>
                                <table>
                                    <tbody>
                                        {faculties.sort((a, b) => String(a.class_name).localeCompare(String(b.class_name))).map((cls, i) =>
                                            <tr key={i}>
                                                <td>
                                                    <LabelCheckbox
                                                        value={String(cls.department_id)}
                                                        id={'faculty-' + String(cls.department_id)}
                                                        name="select-faculty"
                                                        labelText={cls.class_id === null ? 'その他' : `${cls.faculty_name}`}
                                                        defaultChecked={true}
                                                        onChange={function (event) {
                                                            Array.from(document.querySelectorAll(`input[data-f="${cls.faculty_id}"]`)).forEach((checkbox) => { (checkbox as HTMLInputElement).checked = event.target.checked; })
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Col>
                            <Col offset={2} width={11}>
                                <h4>クラス</h4>
                                <table>
                                    <tbody>
                                        {classes.sort((a, b) => String(a.class_name).localeCompare(String(b.class_name))).map((cls, i) =>
                                            <tr key={i}>
                                                <td>
                                                    <LabelCheckbox
                                                        value={String(cls.class_id)}
                                                        id={'class-' + String(cls.class_id)}
                                                        name="select-class"
                                                        labelText={cls.class_id === null ? 'その他' : `${cls.faculty_name} ${cls.department_name} ${cls.class_name}`}
                                                        defaultChecked={true}
                                                        onChange={function (event) {
                                                            Array.from(document.querySelectorAll(`input[data-c="${cls.class_id}"]`)).forEach((checkbox) => { (checkbox as HTMLInputElement).checked = event.target.checked; })
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col width={12}>
                                <button type="button" className="btn btn-full" onClick={function () { Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach((checkbox) => { (checkbox as HTMLInputElement).checked = false; }) }}>全て外す</button>
                            </Col>
                            <Col width={12}>
                                <button type="button" className="btn btn-full" onClick={function () { Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach((checkbox) => { (checkbox as HTMLInputElement).checked = true; }) }}>全てチェック</button>
                            </Col>
                        </Row>
                        <hr />
                        <h4><label>zipファイルのフォルダ構成</label></h4>
                        {
                            [0, 1, 2, 3].map((i) => {
                                const format = formats(i, '{user_id}', '{user_name}', '{student_number}', '{class_id}', '{class_name}', '{department_id}', '{department_name}', '{faculty_id}', '{faculty_name}', '{file_name}');
                                return (
                                    <Row key={i}>
                                        <Col>
                                            <LabelRadio
                                                value={String(i)}
                                                id={'zip_format-' + i}
                                                name={'zip_format'}
                                                labelText={format}
                                                defaultChecked={i === 0}
                                            />
                                            <p>　 例：{
                                                answers[0] !== undefined ? (
                                                    formats(
                                                        i,
                                                        String(answers[0].user_id),
                                                        useableString(answers[0].user_name),
                                                        String(answers[0].student_number),
                                                        String(answers[0].class_id),
                                                        useableString(answers[0].class_name),
                                                        String(answers[0].department_id),
                                                        useableString(answers[0].department_name),
                                                        String(answers[0].faculty_id),
                                                        useableString(answers[0].faculty_name),
                                                        'sample.java',
                                                    )
                                                ) : (
                                                    null
                                                )
                                            }</p>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                        {/* <input type="text" defaultValue={'u{user_id}/{file_name}'} />
                        {'{class_name}-{student_number}-u{user_id}-{user_name}.{ex}'}
                        <br />
                        <ul>
                            <li>ファイル名、フォルダ名に使用できない文字「{'\\/:?"*<>|'}」は使用しないでください。ユーザ名等に混在していた場合は削除されます。</li>
                            <li>重複パス排除のために、ユーザIDを含めてください。</li>
                        </ul> */}

                        <table className="table">
                            <thead>
                                <tr><th>変数</th><th>埋め込み後の値</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>{'{uesr_id}'}</td><td>ユーザID</td></tr>
                                <tr><td>{'{student_number}'}</td><td>出席番号</td></tr>
                                <tr><td>{'{file_name}'}</td><td>言語に応じたファイル名(拡張子込み)</td></tr>
                                <tr><td>{'{class_id}'}</td><td>クラスID</td></tr>
                                <tr><td>{'{class_name}'}</td><td>クラス名</td></tr>
                                <tr><td>{'{department_id}'}</td><td>学科ID</td></tr>
                                <tr><td>{'{department_name}'}</td><td>学科名</td></tr>
                                <tr><td>{'{faculty_id}'}</td><td>分類ID</td></tr>
                                <tr><td>{'{faculty_name}'}</td><td>分類名</td></tr>
                            </tbody>
                        </table>
                        <br />
                        <input type="submit" className="btn btn-full" value="ダウンロードする" />
                    </form>
                </>
            )
            }
        </div >
    );
}

export default ViewAnswers;

const unusableChars = ['\\', '/', ',', ':', '?', '"', '*', '<', '>', '|'];
/**
 * ファイル名、フォルダ名に使用不可能な文字を排除した文字列を返す。
 */
function useableString(val: string | number | null) {
    let rtn = '';
    Array.from(String(val)).forEach((char) => {
        if (!unusableChars.includes(char)) {
            rtn += char;
        }
    });

    return rtn;
}

function formats(idx: number, user_id: number | string, user_name: string, student_number: number | null | string, class_id: number | null | string, class_name: string | null, department_id: number | null | string, department_name: string | null, faculty_id: number | null | string, faculty_name: string | null, file_name: string) {
    return [
        `${user_name}(id:${user_id})/${file_name}`,
        `${class_name}_${student_number}_${user_name}(id:${user_id})/${file_name}`,
        `${faculty_name}(id:${faculty_id})_${department_name}(id:${department_id})_${class_name}(id:${class_id})_${student_number}_${user_name}(id:${user_id})_${file_name}`,
        `${faculty_name}(id:${faculty_id})/${department_name}(id:${department_id})/${class_name}(id:${class_id})/${student_number}_${user_name}(id:${user_id})_${file_name}`
    ][idx];
}

function AnswersTable(props: {
    answers: Array<AnswerBean>,
    question_id: string,
    input_judge: null | Array<string>,
    output_judge: null | Array<string>,
}) {
    const [modalDisplay, setModalDisplay] = useState(true);
    const [modalUser_id, setModalUser_id] = useState<null | number>(null);
    return (
        <>
            <AnswerModal display={modalDisplay} setDisplay={setModalDisplay} question_id={props.question_id} user_id={modalUser_id} input_judge={props.input_judge} output_judge={props.output_judge} />
            <p className="ta-right">※行クリックで詳細表示</p>
            <table className="table" id="answers">
                <thead>
                    <tr>
                        <th style={{ width: '2em' }}>DL</th>
                        <th>ユーザID</th>
                        <th>ユーザ名</th>
                        <th style={{ width: '4em' }}>クラス</th>
                        <th style={{ width: '5em' }}>出席番号</th>
                        <th style={{ width: '5em' }}>言語選択</th>
                        <th>文字数</th>
                        <th>行数</th>
                        <th style={{ width: '10em' }}>提出日時</th>
                        <th style={{ width: '12em' }}>実行結果</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.answers.map((answer, i) => {
                            return (
                                <tr key={i} onClick={function () { setModalUser_id(answer.user_id); setModalDisplay(true); }}>
                                    <td onClick={function (event) {
                                        // 先祖から継承したonclickを解除
                                        event.stopPropagation();
                                        // 直下のチェックボックスを切り替え
                                        const checkbox = (event.target as HTMLElement).getElementsByTagName('input')[0];
                                        checkbox.checked = !checkbox.checked;
                                    }}>
                                        <input
                                            type="checkbox" name="user_id"
                                            value={answer.user_id} defaultChecked={true}
                                            /**
                                             * data-の形式はHTMLのカスタムプロパティ
                                             * 分類、学科、クラスのデータをカスタムプロパティに持たせ、
                                             * querySelectorでグループ化して取得できる。
                                             */
                                            data-f={String(answer.faculty_id)}
                                            data-d={String(answer.department_id)}
                                            data-c={String(answer.class_id)}
                                        />
                                    </td>
                                    <td>{answer.user_id}</td>
                                    <td>{answer.user_name}</td>
                                    <td className="hidden-wrapper">
                                        {answer.class_name}
                                        {answer.class_id === null ? (null) : (
                                            <span className="hidden-text">{answer.faculty_name + ' ' + answer.department_name}</span>
                                        )}
                                    </td>
                                    <td>{answer.student_number}</td>
                                    <td>{getLanguageName(answer.select_language)}</td>
                                    <td>{answer.chars_count}</td>
                                    <td>{answer.rows_count}</td>
                                    <td>{answer.insert_timestamp}</td>
                                    <td>
                                        {
                                            answer.exec_count === 0 ? (
                                                <>実行テスト無し</>
                                            ) : (
                                                <table className="exec-statues-color-view">
                                                    <tbody>
                                                        <tr>
                                                            {
                                                                answer.exec_statuses.map((exec, j) => {
                                                                    const status = ExecStatuses[exec];
                                                                    return (
                                                                        <td key={j} className={'hidden-wrapper exec-result-' + (status.statusCode === ExecStatusCode.Accepted ? 'accepted' : 'wrong')}>
                                                                            <span className="hidden-text">
                                                                                {answer.exec_times[j]}ms
                                                                                <br />
                                                                                {status.statusName}
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                })
                                                            }
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    );
}

function AnswerModal(props: { display: boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>>, question_id: string, user_id: null | number, input_judge: Array<string> | null, output_judge: Array<string> | null }) {
    type AnswerDetail = {
        user_id: number,
        user_name: string,
        student_number: number | null,
        class_id: number | null,
        class_name: string | null,
        department_id: number | null,
        department_name: string | null,
        faculty_id: number | null,
        faculty_name: string | null,
        select_language: number,
        rows_count: number,
        chars_count: number,
        insert_timestamp: string,
        source_code: string,
        executions: Array<{
            exec_time: number,
            exec_status_id: ExecStatusCode,
            output: string
        }>
    };
    const [answers, setAnswers] = useState<Array<AnswerDetail>>([]);
    const [answer, setAnswer] = useState<AnswerDetail>();
    const navigate = useNavigate();

    useEffect(() => {
        if (props.user_id === null) {
            return;
        }
        const search = answers.filter((answer) => answer.user_id === props.user_id);
        if (search.length === 0) {
            type ViewAnswerDetailResponse = ResponseBase & {
                data: AnswerDetail
            };
            axios.get(generateAPI(API.Manager._, API.Manager.viewAnswer) + `/${props.question_id}/${props.user_id}`).then((res: ViewAnswerDetailResponse) => {
                receiveResponse(res, navigate, function () {
                    setAnswer(res.data);
                    setAnswers([...answers, res.data]);
                });
            }).catch(catchError);
        } else {
            setAnswer(search[0]);
        }
    }, [props.user_id, answers, navigate, props.question_id]);
    if (answer === undefined) {
        return (
            null
        );
    }
    return (
        <div id="answer-modal" style={{ display: props.display === true ? 'block' : 'none' }}>
            <div id="modal-back" onClick={function () { props.setDisplay(false); }}></div>
            <div id="modal-content">
                <h2>{answer.user_name}（ユーザID:{answer.user_id}）</h2>
                <p>
                    {answer.faculty_name} {answer.department_name} {answer.class_name}<br />
                    出席番号：{answer.student_number}<br />
                    提出日時：{answer.insert_timestamp}<br />
                    選択言語：{getLanguageName(answer.select_language)}<br />
                    行数　　：{answer.rows_count}<br />
                    文字数　：{answer.chars_count}
                </p>
                <CodeEditor language={answer.select_language} defaultValue={answer.source_code} />
                <div>
                    {answer.executions.map((exec, i) => {
                        const status = ExecStatuses[exec.exec_status_id];

                        return (
                            <Fragment key={i}>
                                <br />
                                <div className={'judge exec-result-' + (status.statusCode === ExecStatusCode.Accepted ? 'accepted' : 'wrong')}>
                                    {<h3>ジャッジ{i + 1}</h3>}
                                    <Row>
                                        <Col>
                                            <b>
                                                <span className="exec-status">
                                                    {status.statusName}
                                                    <span className="exec-status-description">
                                                        {status.description}
                                                    </span>
                                                </span>
                                                &nbsp;&nbsp;{exec.exec_time}ms
                                            </b>
                                            <br />
                                            <br />
                                            <h4>入力値</h4>
                                            <div className="io-block">
                                                {props.input_judge !== null ? props.input_judge[i] : null}
                                            </div>
                                            <br />
                                            <h4>想定する出力値</h4>
                                            <div className="io-block">
                                                {props.output_judge !== null ? props.output_judge[i] : null}
                                            </div>
                                            <br />
                                            <h4>ユーザの出力値</h4>
                                            <div className="io-block">
                                                {exec.output}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <br />
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}

function SpreadSheet(props: { answers: Array<AnswerBean> }) {
    const lang_count: { [key: number]: number } = {};
    let total_score = 0;
    let max_score = 0;
    let min_score = 1.0;
    let max_exec_count = 0;
    const exec_counter = [
        // [解答者数, 正解者数]
        [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
    ];
    props.answers.forEach((answer) => {
        const score = answer.exec_count === 0 ? 1.0 : answer.accepted_count / answer.exec_count;
        total_score += score;
        if (score > max_score) {
            max_score = score;
        }
        if (score < min_score) {
            min_score = score;
        }
        if (lang_count[answer.select_language]) {
            lang_count[answer.select_language] += 1;
        } else {
            lang_count[answer.select_language] = 1;
        }
        if (answer.exec_count > max_exec_count) {
            max_exec_count = answer.exec_count;
        }
        if (answer.exec_count !== 0) {
            answer.exec_statuses.forEach((exec, i) => {
                exec_counter[i][0] += 1;
                if (exec === ExecStatusCode.Accepted) {
                    exec_counter[i][1] += 1;
                }
            });
        }
    });
    const avg_score = total_score / props.answers.length;

    const label_width = 4;
    return (
        <>
            <h4>点数集計</h4>
            <LabelInput
                label={<>平均点</>}
                input={<>{avg_score * 100}</>}
                label_width={label_width}
            />
            <LabelInput
                label={<>最高点</>}
                input={<>{max_score * 100}</>}
                label_width={label_width}
            />
            <LabelInput
                label={<>最低点</>}
                input={<>{min_score * 100}</>}
                label_width={label_width}
            />
            <h4>言語選択</h4>
            {
                Object.keys(lang_count).map((key) => (
                    <LabelInput key={key}
                        label={<>{getLanguageName(Number(key))}</>}
                        input={<>{lang_count[Number(key)]}人</>}
                        label_width={label_width}
                    />
                ))
            }
            <h4>実行テスト毎の正解率</h4>
            {
                function () {
                    const list: Array<JSX.Element> = [];
                    for (let i = 0; i < max_exec_count; i++) {
                        list.push(
                            <LabelInput key={i}
                                label={<>実行テスト{i + 1}</>}
                                input={<>{exec_counter[i][1] / exec_counter[i][0] * 100}%</>}
                                label_width={label_width}
                            />
                        );
                    }
                    return list;
                }()
            }
        </>
    );
}