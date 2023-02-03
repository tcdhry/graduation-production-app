import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExecStatusCode, ExecStatuses } from "../../constants/ExecStatus";
import { getLanguageName } from "../../constants/Language";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import { Row, Col } from "../global_components/24ColLayout";
import CodeEditor from "../global_components/CodeEditor";

type RankingRow = {
    user_id: number,
    student_number: number | null,
    user_view_name: string,
    class_name: string | null,
    department_name: string | null,
    faculty_name: string | null,
    select_language: number,
    chars_count: number,
    rows_count: number,
    score: number,
    min_time: number
};

function SingleQuestionRanking() {
    const question_id = useParams().question_id;
    const navigate = useNavigate();
    const [notFound, setNotFound] = useState<boolean>();
    const [passwordRequired, setPasswordRequired] = useState<boolean>();
    const [privateAnswerMode, setPrivateAnswerMode] = useState<boolean>();
    const [title, setTitle] = useState<null | string>();
    const [ranking, setRanking] = useState<null | Array<RankingRow>>();
    const [modalDisplay, setModalDisplay] = useState(true);
    const [modalUser_id, setModalUser_id] = useState<null | number>(null);

    useEffect(() => {
        type RankingResponse = ResponseBase & {
            data: {
                not_found: boolean,
                password_required: boolean,
                private_answer_mode: boolean,
                question_title: null | string,
                ranking: null | Array<RankingRow>
            }
        };
        axios.get(generateAPI(API.User._, API.User.ranking) + '/' + question_id).then((res: RankingResponse) => {
            receiveResponse(res, navigate, function () {
                setNotFound(res.data.not_found);
                setPasswordRequired(res.data.password_required);
                setPrivateAnswerMode(res.data.private_answer_mode);
                setTitle(res.data.question_title);
                setRanking(res.data.ranking);
            });
        }).catch(catchError);
    }, [navigate, question_id]);

    return (
        <>
            <h2>他の人の解答を参考にする</h2>
            <p>
                問題番号：{question_id}<br />
                タイトル：{title}<br />
            </p>
            {notFound === true ? (<p>この問題は存在しないか、公開されていないため、解答を見ることができません。</p>) : null}
            {passwordRequired === true ? (
                <p>
                    パスワードが必要な問題です。<br/>
                    問題を表示してからやり直してください。
                </p>
            ) : null}
            {privateAnswerMode === true ? (<p>この問題は、他の人の解答を参考にできない設定です。ズルはいけませんよ。</p>) : null}
            {notFound === false && passwordRequired === false && privateAnswerMode === false ? (
                <>
                    <AnswerModal
                        user_id={modalUser_id}
                        display={modalDisplay}
                        setDisplay={setModalDisplay}
                        question_id={question_id!}
                    />
                    <p className="ta-right">※行クリックで詳細表示</p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '2em' }}>No</th>
                                <th>ユーザ</th>
                                <th>所属</th>
                                <th>ユーザID</th>
                                <th style={{ width: '4em' }}>文字数</th>
                                <th style={{ width: '3em' }}>行数</th>
                                <th style={{ width: '3em' }}>点数</th>
                                <th style={{ width: '5em' }}>選択言語</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ranking!.map((row, i) => {
                                    return (
                                        <tr key={i} onClick={function () { setModalDisplay(true); setModalUser_id(row.user_id); }}>
                                            <th><span data-no={i + 1}>{i + 1}</span></th>
                                            <td className="hidden-wrapper">{row.user_view_name}</td>
                                            <td>{row.faculty_name} {row.department_name} {row.class_name} {row.student_number}</td>
                                            <td>{row.user_id}</td>
                                            <td>{row.chars_count}</td>
                                            <td>{row.rows_count}</td>
                                            <td>{row.score}</td>
                                            <td>{getLanguageName(row.select_language)}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </>
            ) : null}
        </>
    );
}

export default SingleQuestionRanking;

function AnswerModal(props: { display: boolean, setDisplay: React.Dispatch<React.SetStateAction<boolean>>, question_id: string, user_id: null | number }) {
    type AnswerDetail = {
        user_id: number,
        user_view_name: string,
        student_number: number | null,
        class_name: string | null,
        department_name: string | null,
        faculty_name: string | null,
        select_language: number,
        rows_count: number,
        chars_count: number,
        insert_timestamp: string,
        source_code: string,
        executions: Array<{
            exec_time: number,
            exec_status_id: ExecStatusCode,
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
            axios.get(generateAPI(API.User._, API.User.viewAnswer) + `/${props.question_id}/${props.user_id}`).then((res: ViewAnswerDetailResponse) => {
                receiveResponse(res, navigate, function () {
                    setAnswer(res.data);
                    setAnswers([...answers, res.data]);
                });
            }).catch(catchError);
        } else {
            setAnswer(search[0]);
        }
    }, [props.user_id, props.question_id, answers, navigate]);
    if (answer === undefined) {
        return (
            null
        );
    }
    return (
        <div id="answer-modal" style={{ display: props.display === true ? 'block' : 'none' }}>
            <div id="modal-back" onClick={function () { props.setDisplay(false); }}></div>
            <div id="modal-content">
                <h2>{answer.user_view_name}（ユーザID:{answer.user_id}）</h2>
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