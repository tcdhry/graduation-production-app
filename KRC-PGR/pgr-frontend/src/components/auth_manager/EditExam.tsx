import axios from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SimpleMyQuestionBean } from "../../beans/QuestionBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { getLanguageName } from "../../constants/Language";
import { ResponseBase, receiveResponse, catchError } from "../../constants/ResponseStatus";
import { generateAPI, API, generateURL, URL } from "../../constants/URL";
import Loading from "../errors/Loading";
import NotFoundError from "../errors/NotFoundError";
import { Row, Col } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";
import { LargeTextArea } from "../global_components/LargeTextArea";
import InputTable from "./manager_components/ExamTableInputs";

type ExamBean = {
    exam_id: number,
    exam_title: string,
    description: string,
    uuid: string,
    insert_timestamp: string,
    question_ids: number[],
    allocate_scores: number[],
    release_flag: boolean
}

function EditExam() {
    const exam_id = useParams().exam_id;
    const navigate = useNavigate();
    const [exam, setExam] = useState<ExamBean | null>();
    const [questions, setQuestions] = useState<Array<SimpleMyQuestionBean>>();
    const [titleLength, setTitleLength] = useState(0);
    const [description, setDescription] = useState<string>('');
    const [defaultValues, setDefaultValues] = useState<Array<{ question_id: string, allocate_score: number }>>([]);

    const [submitting, setSubmitting] = useState(false);



    useEffect(() => {
        type GetMyExamResponse = ResponseBase & {
            data: {
                exam: ExamBean | null
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.getMyExam) + '/' + exam_id).then((res: GetMyExamResponse) => {
            receiveResponse(res, navigate, function () {
                setExam(res.data.exam);
                if (res.data.exam) {
                    const exam = res.data.exam;
                    setDescription(exam.description);
                    setTitleLength(exam.exam_title.length);
                    setDefaultValues(
                        exam.question_ids.map((qid, i) => { return { question_id: String(qid), allocate_score: exam.allocate_scores[i] } })
                    );
                }
            });
        }).catch(catchError);
        type ViewMyQuestionsResponse = ResponseBase & {
            data: {
                questions: Array<SimpleMyQuestionBean>,
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.getMyAllQuestions)).then((res: ViewMyQuestionsResponse) => {
            receiveResponse(res, navigate, function () {
                setQuestions(res.data.questions);
            });
        });
    }, [exam_id, navigate]);

    if (exam === undefined) {
        return (<Loading />);
    }
    if (questions === undefined) {
        return (<Loading />);
    }

    if (exam === null) {
        return (<NotFoundError />);
    }


    const label_width = 5;
    return (
        <div id="edit-exam">
            <h2>試験の編集</h2>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                if (submitting === true) {
                    return;
                }
                const form = event.target;

                const exam_title = form.exam_title.value;
                if (exam_title === '') {
                    alert('試験タイトルが入力されていません。');
                    return;
                }

                const description = form.description.value;

                const password = form.password.value;
                const password_check = form.password_check.value;
                if (password !== password_check) {
                    alert('パスワードが確認と一致しません。');
                    return;
                }

                const release_flag = form.release_flag.checked;

                const table: HTMLTableElement = form.querySelector('#input_table');
                if (table.querySelector('tbody tr[data-error-flag="true"]') !== null) {
                    alert('不正な問題番号が指定されています。')
                    return;
                }

                const question_ids = (Array.from(table.querySelectorAll('input[name="question_id"]')) as Array<HTMLInputElement>).map((input) => input.value);
                if (question_ids.length === 0) {
                    alert('問題が1つも登録されていません。');
                    return;
                }

                if (hasDuplicates(question_ids)) {
                    alert('重複した問題番号が入力されています。');
                    return;
                }
                const allocate_scores = (Array.from(table.querySelectorAll('input[name="allocate_score"]')) as Array<HTMLInputElement>).map((input) => input.value);

                if (table.querySelector('td[data-warning-flag="true"]') !== null) {
                    if (window.confirm('試験に登録するには推奨されない設定の問題が含まれています。\nこのまま更新しますか？') === false) {
                        return;
                    }
                } else {
                    if (window.confirm('更新しますか？') === false) {
                        return;
                    }
                }

                setSubmitting(true);
                type EditExamResponse = ResponseBase & {
                    data: {
                        success: boolean
                    }
                };
                axios.post(generateAPI(API.Manager._, API.Manager.editExam) + '/' + exam_id, {
                    exam_title: exam_title,
                    description: description,
                    password: password,
                    password_check: password_check,
                    release_flag: release_flag,
                    question_ids: question_ids.map(id => Number(id)),
                    allocate_scores: allocate_scores.map(score => Number(score))
                }).then((res: EditExamResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            alert('更新処理が完了しました');
                        } else {
                            alert('更新失敗');
                        }
                    });
                }).catch(catchError).finally(() => { setSubmitting(false) });
            }}>

                <LabelInput
                    label={<label htmlFor="exam_title">試験タイトル *必須<br />{titleLength} / 100</label>}
                    input={<input type="text" id="exam_title" defaultValue={exam.exam_title} required maxLength={100} onChange={function (event) { setTitleLength(event.target.value.length); }} />}
                    label_width={label_width}
                />

                <LabelInput
                    label={<>投稿日時</>}
                    input={<>{exam.insert_timestamp}</>}
                    label_width={label_width}
                />

                <LabelInput
                    label={<>試験ID</>}
                    input={<>{exam.exam_id}-{exam.uuid}</>}
                    label_width={label_width}
                />
                <LabelInput
                    label={<>共有リンク</>}
                    input={
                        <>
                            <Link to={generateURL(URL.User._, URL.User.viewExam) + `/${exam.exam_id}-${exam.uuid}`} className="text-link">
                                {window.location.hostname}:{window.location.port}{generateURL(URL.User._, URL.User.viewExam)}/{exam.exam_id}-{exam.uuid}
                            </Link>
                        </>
                    }
                    label_width={label_width}
                />

                <LabelInput
                    label={
                        <label htmlFor="description">
                            説明文<br />
                            マークダウン形式<br />
                            {description.length} / 1000
                        </label>
                    }
                    input={
                        <LargeTextArea
                            id="description"
                            onChange={function (event) { setDescription(event.target.value); }}
                            maxLength={1000}
                            defaultValue={exam.description}
                        />
                    }
                    label_width={label_width}
                />

                <LabelInput
                    label={<>説明文プレビュー</>}
                    input={<ReactMarkdown children={description} className="markdown" />}
                    label_width={label_width}
                />

                <LabelInput
                    label={<label htmlFor="password">パスワード *必須</label>}
                    input={
                        <>
                            <input type="password" autoComplete="one-time-code" id="password" name="exam-password" />
                            <p>パスワード未入力の場合、パスワードは更新されません。</p>
                        </>
                    }
                    label_width={label_width}
                />
                <LabelInput
                    label={<label htmlFor="password">パスワード（確認）</label>}
                    input={<input type="password" autoComplete="one-time-code" id="password_check" name="exam-password" />}
                    label_width={label_width}
                />

                <LabelInput
                    label={<label htmlFor="release_flag">試験を公開する</label>}
                    input={<p><input type="checkbox" id="release_flag" defaultChecked={exam.release_flag} />&nbsp;チェックすると試験のURLを知っている人がアクセスできるようになります。</p>}
                    label_width={label_width}
                />

                <hr />

                <Row>
                    <Col>
                        <h3>登録可能な自分の問題一覧</h3>
                        <div id="limit-y-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '5em' }}>問題番号</th>
                                        <th>問題タイトル</th>
                                        <th style={{ width: '10em' }}>投稿日時</th>
                                        <th style={{ width: '5em' }}>公開設定</th>
                                        <th style={{ width: '5em' }}>言語指定</th>
                                        <th style={{ width: '6em' }}>パスワード</th>
                                        <th style={{ width: '5em' }}>解答参考</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question, i) => (
                                        <tr key={i}>
                                            <th>{question.question_id}</th>
                                            <td>{question.question_title}</td>
                                            <td>{question.insert_datetime}</td>
                                            <td>{question.release_flag === true ? '公開' : '非公開'}</td>
                                            <td>{question.language_designation === null ? '指定なし' : getLanguageName(question.language_designation)}</td>
                                            <td>{question.password_required === true ? '必須' : '不要'}</td>
                                            <td>{question.private_answer_mode === true ? '不可' : '可'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>

                <hr />
                <Row>
                    <Col>
                        <h3>試験に追加する問題を選択</h3>
                        <InputTable questions={questions} defaultValues={defaultValues} />
                    </Col>
                </Row>

                <hr />

                <Row>
                    <Col>
                        <input type="submit" className="btn btn-full" value="試験の更新を確定する" />
                    </Col>
                </Row>
            </form>
        </div>
    );
}

export default EditExam;

function hasDuplicates(array: Array<string>) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                return true;
            }
        }
    }
    return false;
}