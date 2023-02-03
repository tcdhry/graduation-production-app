import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ExecStatusCode, ExecStatuses } from "../../constants/ExecStatus";
import { getLanguageName, LanguageCode } from "../../constants/Language";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import { Col, Row } from "../global_components/24ColLayout";
import CodeEditor from "../global_components/CodeEditor";

const label_width = 4;

type AnswerData = {
    success: boolean,
    question_title: string,
    select_language: LanguageCode | null,
    rows_count: number,
    chars_count: number,
    timestamp: string,
    source_code: string,
    executions: Array<{ exec_time: number, exec_status_id: ExecStatusCode }>
};
function ViewAnswer() {
    const question_id = useParams().question_id;
    const navigate = useNavigate();

    const [answerData, setAnswerData] = useState<undefined | AnswerData | null>();

    useEffect(() => {
        type ViewAnswerResponse = ResponseBase & {
            data: AnswerData
        };
        axios.get(generateAPI(API.User._, API.User.viewAnswer) + '/' + question_id).then((res: ViewAnswerResponse) => {
            receiveResponse(res, navigate, function () {
                if (res.data.success === true) {
                    setAnswerData(res.data);
                } else {
                    setAnswerData(null);
                }
            })
        }).catch(catchError);
    }, [question_id, navigate]);

    return (
        <div id="view-answer">
            <h2>提出した解答を確認</h2>
            <AnswerView question_id={question_id} answerData={answerData} />
        </div>
    );
}

export default ViewAnswer;


function AnswerView(props: { question_id: string | undefined, answerData: undefined | AnswerData | null }) {
    const answer = props.answerData;

    if (answer === undefined) {
        return (
            null
        );
    }

    if (answer === null) {
        return (
            <>
                存在しない問題か、まだ解答を提出していないようです。
            </>
        );
    }

    return (
        <>
            <h3>ジャッジ結果</h3>

            {
                answer.executions === null ? (
                    null
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>入出力</th>
                                <th>実行時間</th>
                                <th>判定</th>
                                <th>判定説明</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                answer.executions.map((exec, i) => {
                                    return (
                                        <tr key={i} className={'exec-result-' + (ExecStatuses[exec.exec_status_id].statusCode === ExecStatusCode.Accepted ? 'accepted' : 'wrong')}>
                                            <th>{i + 1}</th>
                                            <td>{exec.exec_time}ms</td>
                                            <td>{ExecStatuses[exec.exec_status_id].statusName}</td>
                                            <td>{ExecStatuses[exec.exec_status_id].description}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                )
            }
            <hr />
            <Row>
                <Col width={label_width}>
                    問題
                </Col>
                <Col width={24 - label_width}>
                    <Link to={generateURL(URL.User._, URL.User.viewQuestion) + '/' + props.question_id} className="text-link">
                        {answer.question_title}
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col width={label_width}>
                    選択した言語
                </Col>
                <Col width={24 - label_width}>
                    {answer.select_language === null ? ('無し') : (getLanguageName(answer.select_language))}
                </Col>
            </Row>
            <Row>
                <Col width={label_width}>
                    行数
                </Col>
                <Col width={24 - label_width}>
                    {answer.rows_count}
                </Col>
            </Row>
            <Row>
                <Col width={label_width}>
                    文字数
                </Col>
                <Col width={24 - label_width}>
                    {answer.chars_count}
                </Col>
            </Row>
            <hr />
            <h3>提出したソースコード</h3>
            <CodeEditor defaultValue={answer.source_code} language={answer.select_language} />
        </>
    );
}