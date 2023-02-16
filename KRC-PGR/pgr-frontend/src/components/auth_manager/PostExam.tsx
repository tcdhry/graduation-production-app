import axios from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { SimpleMyQuestionBean } from "../../beans/QuestionBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { getLanguageName } from "../../constants/Language";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import Loading from "../errors/Loading";
import { Col, Row } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";
import { LargeTextArea } from "../global_components/LargeTextArea";
import InputTable from "./manager_components/ExamTableInputs";

const label_width = 5;

function PostExam() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Array<SimpleMyQuestionBean>>();
    const [titleLength, setTitleLength] = useState(0);
    const [description, setDescription] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
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
    }, [navigate]);

    if (questions === undefined) {
        return (<Loading />);
    }

    return (
        <div id="post-exam">
            <h2>試験を投稿する</h2>
            <LabelInput
                label={<>試験とは...</>}
                input={
                    <p>
                        複数の問題をグルーピングして試験として登録できます。<br />
                        試験の一覧ページは存在しません。URLの共有でのみ公開が可能です。<br />
                        試験に登録できるのは自分が投稿した問題のみです。<br />
                        問題を公開設定にしていなくても、試験経由であれば表示できます。<br />
                    </p>
                }
                label_width={label_width}
            />
            <LabelInput
                label={<>期末試験での<br />推奨運用方法</>}
                input={
                    <p>
                        ・問題は全て非公開設定。<br />
                        ・試験開始時にURLとパスワードを公開。<br />
                        ・試験終了時に試験を非公開設定に変更。（終了以後の再提出を防ぐため。）<br />
                        ・解答の提出日時が試験終了後のものは不正と判定。（申し訳ありません。再提出前の解答はバックアップされません。）<br />
                        ・複数クラスが同じ試験を受ける場合は、クラスの分だけ試験を複製する。（同時受験の場合は締め切り時間を揃えれば問題ありません。）<br />
                        ・試験終了直後に解答と集計情報をダウンロード。
                    </p>
                }
                label_width={label_width}
            />
            <hr />
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
                if (password === '') {
                    alert('パスワードが入力されていません。');
                    return;
                }

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
                    if (window.confirm('試験に登録するには推奨されない設定の問題が含まれています。\nこのまま登録しますか？') === false) {
                        return;
                    }
                } else {
                    if (window.confirm('登録しますか？') === false) {
                        return;
                    }
                }

                setSubmitting(true);
                type PostExamResponse = ResponseBase & {
                    data: {
                        success: boolean,
                        exam_id: number,
                        uuid: string,
                    }
                };
                axios.post(generateAPI(API.Manager._, API.Manager.postExam), {
                    exam_title: exam_title,
                    description: description,
                    password: password,
                    password_check: password_check,
                    release_flag: release_flag,
                    question_ids: question_ids.map(id => Number(id)),
                    allocate_scores: allocate_scores.map(score => Number(score))
                }).then((res: PostExamResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.success === true) {
                            navigate(generateURL(URL.Manager._, URL.Manager.editExam) + '/' + res.data.exam_id);
                        } else {
                            alert('登録失敗');
                        }
                    });
                }).catch(catchError).finally(() => { setSubmitting(false) });
            }}>
                <LabelInput
                    label={<label htmlFor="exam_title">試験タイトル *必須<br />{titleLength} / 100</label>}
                    input={<input type="text" id="exam_title" required maxLength={100} onChange={function (event) { setTitleLength(event.target.value.length); }} />}
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
                            defaultValue={null}
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
                    input={<input type="password" required autoComplete="one-time-code" id="password" name="exam-password" />}
                    label_width={label_width}
                />
                <LabelInput
                    label={<label htmlFor="password">パスワード（確認）</label>}
                    input={<input type="password" required autoComplete="one-time-code" id="password_check" name="exam-password" />}
                    label_width={label_width}
                />

                <LabelInput
                    label={<label htmlFor="release_flag">試験を公開する</label>}
                    input={<p><input type="checkbox" id="release_flag" />&nbsp;チェックすると試験のURLを知っている人がアクセスできるようになります。</p>}
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
                        <InputTable questions={questions} />
                    </Col>
                </Row>

                <hr />

                <Row>
                    <Col>
                        <input type="submit" className="btn btn-full" value="試験を投稿する" />
                    </Col>
                </Row>
            </form>
        </div>
    );
}

export default PostExam;

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