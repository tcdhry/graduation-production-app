import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionBean, QuestionThumbnail } from "../../beans/QuestionBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import Loading from "../errors/Loading";
import { Col, Row } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";
import QuestionsListView from "../global_components/QuestionsListView";
import QuestionView, { ExecConfirmButtonName } from "../global_components/QuestionView";
import useErrorMessageState from "../global_components/useErrorMessageState";
import AceEditor from "react-ace";
import { AnswerConfirmStatus, ExecConfirmStatus, ExecStatus } from "../../beans/ExecStatus";
import { ExecStatuses, ExecStatusCode } from "../../constants/ExecStatus";


const label_width = 5;
function InputViewPasswordForm(props: { thumbnail: QuestionThumbnail, setQuestion: React.Dispatch<React.SetStateAction<QuestionBean | undefined | null>>, setThumbnail: React.Dispatch<React.SetStateAction<QuestionThumbnail | undefined | null>> }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useErrorMessageState();

    return (
        <>
            <Row>
                <Col>
                    <h2>パスワードを入力</h2>
                    <p>
                        この問題を表示するにはパスワードが必要です。
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <QuestionsListView questions={[props.thumbnail]} toURL={generateURL(URL.User._, URL.User.viewQuestion)} />
                </Col>
            </Row>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const view_password = event.target.view_passowrd.value;

                if (view_password === '') {
                    setErrorMessage('パスワードを入力してください。');
                    return;
                }

                type QuestionWithPasswordResponse = ResponseBase & {
                    data: {
                        question: QuestionBean
                    }
                }
                axios.post(generateAPI(API.User._, API.User.questionWithPassword) + '/' + props.thumbnail.question_id, { view_password: view_password }).then((res: QuestionWithPasswordResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.question === null) {
                            setErrorMessage('パスワードが間違っています。');
                        } else {
                            props.setQuestion(res.data.question);
                            props.setThumbnail(null);
                        }
                    });
                }).catch(catchError);
            }}>
                <LabelInput
                    label={<label htmlFor="view_passowrd">表示パスワード</label>}
                    input={
                        <>
                            <input type="password" id="view_passowrd" name="view_passowrd" autoComplete="one-time-code" />
                            {errorMessage}
                        </>
                    }
                    label_width={label_width}
                />

                <Row>
                    <Col>
                        <input type="submit" value="パスワード検証" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}


function QuestionConfirmForm(props: { question: QuestionBean }) {
    const editorRef = useRef<AceEditor>(null);
    const navigate = useNavigate();
    const params = useParams();
    const [execList, setExecList] = useState<Array<ExecStatus>>([]);
    const [answerConfirmMessage, setAnswerConfirmMessage] = useErrorMessageState();
    const [submitting, setSubmitting] = useState(false);

    return (
        <>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();

                // https://github.com/securingsincity/react-ace/issues/685
                const source_code = (editorRef.current! as AceEditor).editor.getValue();
                // 言語指定が無ければ選択言語を取得、言語指定があればその言語IDを取得。
                const select_language = props.question.language_designation === null ? Number(event.target.language_designation.value) : props.question.language_designation;


                switch (event.nativeEvent.submitter.name) {
                    case ExecConfirmButtonName:
                        // 提出前実行確認
                        if (source_code === '') {
                            alert('プログラムが入力されていません。');
                            return;
                        }
                        if (isNaN(select_language)) {
                            alert('言語が選択されていません。');
                            return;
                        }
                        setSubmitting(true);
                        type ExecConfirmResponse = ResponseBase & {
                            data: {
                                execConfirmStatus: ExecConfirmStatus,
                                execList: Array<ExecStatus>
                            }
                        };
                        axios.post(generateAPI(API.User._, API.User.execConfirm) + '/' + params.question_id, { source_code: source_code, select_language: select_language })
                            .then((res: ExecConfirmResponse) => {
                                receiveResponse(res, navigate, function () {
                                    if (res.data.execConfirmStatus === ExecConfirmStatus.SUCCESS) {
                                        setExecList(res.data.execList);
                                        window.setTimeout(() => {
                                            document.getElementById('exec-confirm-result')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 1);
                                    } else {
                                        alert('エラー');
                                    }
                                });
                            }).catch(catchError).finally(() => { setSubmitting(false); });
                        break;
                    case AnswerConfirmButtonName:
                        // 解答確定提出
                        if (submitting === true) {
                            return;
                        }
                        setAnswerConfirmMessage('　');
                        setSubmitting(false);

                        if (source_code === '') {
                            alert('プログラムが入力されていません。');
                            return;
                        }
                        if (!window.confirm('解答を確定して提出しますか？')) {
                            return;
                        }

                        setAnswerConfirmMessage('提出中');
                        setSubmitting(true);
                        type AnswerConfirmResponse = ResponseBase & {
                            data: {
                                answerConfirmStatus: AnswerConfirmStatus,
                            }
                        }
                        axios.post(generateAPI(API.User._, API.User.answerConfirm) + '/' + params.question_id, { source_code: source_code, select_language: select_language })
                            .then((res: AnswerConfirmResponse) => {
                                receiveResponse(res, navigate, function () {
                                    if (res.data.answerConfirmStatus === AnswerConfirmStatus.SUCCESS) {
                                        navigate(generateURL(URL.User._, URL.User.viewAnswer) + '/' + props.question.question_id);
                                    } else {
                                        alert('提出中にエラーが発生しました。');
                                        setAnswerConfirmMessage('　');
                                    }
                                });
                            }).catch(catchError).finally(() => { setSubmitting(false); });
                        break;
                }
            }}>
                <QuestionView question={props.question} editorRef={editorRef} />

                {
                    execList.length === 0 ? (
                        null
                    ) : (
                        <div id="exec-confirm-result">
                            <h3>実行確認結果</h3>
                            {
                                function () {
                                    const list: Array<JSX.Element> = [];
                                    let i = 0;
                                    execList.forEach((exec) => {
                                        list.push(
                                            <Fragment key={i}>
                                                <div className={'exec-result-' + (exec.execStatusCode === ExecStatusCode.Accepted ? 'accepted' : 'wrong')}>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>
                                                                    入出力例{i + 1}
                                                                </th>
                                                                <td>
                                                                    <span className="exec-status">
                                                                        {ExecStatuses[exec.execStatusCode].statusName}
                                                                        <span className="exec-status-description">
                                                                            {ExecStatuses[exec.execStatusCode].description}
                                                                        </span>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>入力値</th>
                                                                <td className="io-block">
                                                                    {props.question.inputs[i]}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>出力値</th>
                                                                <td className="io-block">
                                                                    {exec.output}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>正答出力値</th>
                                                                <td className="io-block">
                                                                    {props.question.outputs[i]}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>実行時間</th>
                                                                <td>
                                                                    {exec.execTime}ms
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <hr />
                                            </Fragment>
                                        );
                                        i++;
                                    });
                                    return list;
                                }()
                            }
                        </div>
                    )
                }

                <Row>
                    <Col>
                        <input type="submit" value="提出" className="btn btn-full" name={AnswerConfirmButtonName} />
                        <br />
                        {answerConfirmMessage}
                    </Col>
                </Row>
            </form>
        </>
    );
}


const AnswerConfirmButtonName = 'answer-confirm-button';

function ViewQuestion() {
    const params = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<QuestionBean | undefined | null>(undefined);
    const [thumbnail, setThumbnail] = useState<QuestionThumbnail | undefined | null>(undefined);

    useEffect(() => {
        type QuestionResponse = ResponseBase & {
            data: {
                question: QuestionBean | null,
                thumbnail: QuestionThumbnail | null
            }
        }
        axios.get(generateAPI(API.User._, API.User.question) + '/' + params.question_id).then((res: QuestionResponse) => {
            receiveResponse(res, navigate, function () {
                setQuestion(res.data.question);
                setThumbnail(res.data.thumbnail);
            });
        }).catch(catchError);
    }, [navigate, params.question_id]);


    /**
     * question, thumbnail
     * 初期値 undefined
     * 通信後 null | Bean
     * ------------------------------------------
     * | question  | thumbnail | 状態           |
     * |-----------|-----------|----------------|
     * | undefined | undefined | Loading        |
     * | null      | null      | NotFound       |
     * | not null  | null      | input password |
     * | null      | not undef | view question  |
     * ------------------------------------------
     */

    /**
     * ここ以降undefined判定を省くため || で判定する。
     * 片方のみundefinedはロジック上あり得ないためこれでよし。
     */
    if (question === undefined || thumbnail === undefined) {
        return (
            <Loading />
        );
    }

    if (question !== null) {
        return (
            <QuestionConfirmForm question={question} />
        );
    }

    if (thumbnail !== null) {
        return (
            <InputViewPasswordForm thumbnail={thumbnail} setQuestion={setQuestion} setThumbnail={setThumbnail} />
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <h2>問題を表示できません</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    問題ID：`{params.question_id}` の問題は、存在しないか公開されていません。
                </Col>
            </Row>
        </>
    );
}

export default ViewQuestion;