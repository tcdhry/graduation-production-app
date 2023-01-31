import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { QuestionBean } from "../../beans/QuestionBean";
import { getLanguageName, LanguageCode, Languages } from "../../constants/Language";
import { Col, Row } from "./24ColLayout";
import CodeEditor from "./CodeEditor";
import AceEditor from "react-ace";
import { Link } from "react-router-dom";
import { generateURL, URL } from "../../constants/URL";

export const ExecConfirmButtonName = 'exec-confirm-button';

function QuestionView(props: { question: QuestionBean, editorRef: undefined | React.RefObject<AceEditor> }) {
    const [selectLang, setSelectLang] = useState<LanguageCode | null>(props.question.language_designation);
    useEffect(() => {
        /**
         * これ無くても動く想定だったがなぜか動かん
         */
        setSelectLang(props.question.language_designation);
    }, [props.question.language_designation]);

    return (
        <div id="question-view">
            <Row>
                <Col>
                    <h2>{props.question.question_title}</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p id="question-status">
                        <span>問題ID：{props.question.question_id}</span>
                        <span>投稿者：{props.question.user_view_name}</span>
                        <span>投稿者ID：{props.question.user_id}</span>
                        <span>投稿日時：{props.question.insert_datetime}</span>
                    </p>
                </Col>
            </Row>

            <Row>
                <Col>
                    {props.question.answered === true ? (
                        <Link to={generateURL(URL.User._, URL.User.viewAnswer) + '/' + props.question.question_id} className="text-link">提出済みの解答を確認</Link>
                    ) : (<></>)}
                    <br />
                    {props.question.private_answer_mode === true ? (<></>) : (
                        <Link to={generateURL(URL.User._, URL.User.ranking) + '/' + props.question.question_id} className="text-link">他の人の解答を参考にする</Link>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <h3>問題文</h3>
                    <ReactMarkdown children={props.question.question_text} className="markdown" />
                </Col>
            </Row>

            <hr />

            <Row>
                <Col>
                    <h3>入力形式</h3>
                    <div className="io-block">
                        {props.question.input}
                    </div>
                    <ReactMarkdown children={props.question.input_explain} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <h3>出力形式</h3>
                    <div className="io-block">
                        {props.question.output}
                    </div>
                    <ReactMarkdown children={props.question.output_explain} />
                </Col>
            </Row>

            <hr />

            {
                function () {
                    const list: Array<JSX.Element> = [];
                    for (let i = 0; i < 3; i++) {
                        const viewidx = i + 1;
                        if (props.question.inputs[i] === null && props.question.outputs[i] === null && props.question.io_explain[i] === null) {
                            break;
                        }
                        list.push(<div key={i}>
                            <Row>
                                <Col>
                                    <h3>入力例{viewidx}</h3>
                                    <div className="io-block">
                                        {props.question.inputs[i]}
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <h3>出力例{viewidx}</h3>
                                    <div className="io-block">
                                        {props.question.outputs[i]}
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <h3>入出力例{viewidx} 補足</h3>
                                    <ReactMarkdown children={props.question.io_explain[i] === null ? '' : props.question.io_explain[i] as string} />
                                </Col>
                            </Row>
                        </div>);
                    }
                    return list;
                }()
            }

            <hr />

            <Row>
                <Col>
                    <h3>言語指定</h3>
                    {function () {
                        if (props.question.language_designation === null) {
                            return (
                                <>
                                    この問題に言語指定はありません。<br />
                                    好きな言語を選択して解答してください。<br />
                                    <select id="language_designation" onChange={(event) => {
                                        // console.log(event.target.options[event.target.selectedIndex].innerText);
                                        setSelectLang(Number(event.target.value));
                                    }}>
                                        <option value="null" style={{ display: 'none' }}>言語を選択</option>
                                        {
                                            function () {
                                                const list: Array<JSX.Element> = [];
                                                Languages.forEach((lang) => {
                                                    list.push(<option value={lang.language_id} key={lang.language_id}>{lang.language_name}</option>);
                                                });
                                                return (list);
                                            }()
                                        }
                                    </select>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    この問題は{getLanguageName(props.question.language_designation)}限定の問題です。
                                </>
                            );
                        }
                    }()}
                </Col>
            </Row>

            <Row>
                <Col>
                    <CodeEditor language={selectLang} editorRef={props.editorRef} />
                </Col>
            </Row>

            {
                props.question.inputs[0] === null && props.question.outputs[0] === null && props.question.io_explain[0] === null ? (
                    <></>
                ) : (
                    <Row>
                        <Col>
                            <input type="submit" value="実行確認" className="btn btn-full" name={ExecConfirmButtonName} />
                        </Col>
                    </Row>
                )
            }
        </div>
    );
}

export default QuestionView;