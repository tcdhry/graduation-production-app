import { useState } from "react";
import { QuestionBean } from "../../../beans/QuestionBean";
import { Languages } from "../../../constants/Language";
import LabelInput from "../../global_components/LabelInput";
import { LargeTextArea } from "../../global_components/LargeTextArea";
import { Row, Col } from "../../global_components/24ColLayout";
import SmoothScrollLink from "../../global_components/SmoothScrollLink";
import axios from "axios";
import { API, generateAPI } from "../../../constants/URL";
import { catchError, receiveResponse, ResponseBase } from "../../../constants/ResponseStatus";
import { useNavigate } from "react-router-dom";

export enum TitleStatus {
    NotEntered = 0,     // 未入力
    NotExistTitle = 1,  // 使用可能なタイトル
    DefaultTitle = 2,   // 編集時、元のタイトル
    ExistTitle = 3,     // 使用不可のタイトル（重複）
    WhitespaceOnly = 4, // 使用不可のタイトル（空白文字のみ）
}

function QuestionTitleInput(props: { setter: Function, defaultTitle: string | undefined, titleStatus: TitleStatus, setTitleStatus: React.Dispatch<React.SetStateAction<TitleStatus>> }) {
    const [length, setLength] = useState(0);
    const navigate = useNavigate()

    return (
        <LabelInput label={
            <label htmlFor="question_title">
                タイトル *必須<br />
                {length} / 50
            </ label>
        } input={
            <>
                <input type="text" autoComplete="one-time-code"
                    onChange={(event) => {
                        const val = event.target.value;
                        const len = val.length;
                        setLength(len);
                        props.setter(val);
                        if (len === 0) {
                            props.setTitleStatus(TitleStatus.NotEntered);
                        } else if (val === props.defaultTitle) {
                            props.setTitleStatus(TitleStatus.DefaultTitle);
                        } else if (val.replace(/\s+/g, '').length === 0) {
                            props.setTitleStatus(TitleStatus.WhitespaceOnly);
                        } else {
                            type TitleCheckResponse = ResponseBase & {
                                data: {
                                    notExistTitle: boolean
                                }
                            }
                            axios.post(generateAPI(API.Manager._, API.Manager.titleCheck), { question_title: val }).then((res: TitleCheckResponse) => {
                                receiveResponse(res, navigate, function () {
                                    props.setTitleStatus(res.data.notExistTitle === true ? TitleStatus.NotExistTitle : TitleStatus.ExistTitle);
                                });
                            }).catch(catchError)
                        }
                    }}
                    id="question_title"
                    name="question_title"
                    maxLength={50}
                />
                <p className="error-message">
                    {function () {
                        switch (props.titleStatus) {
                            case TitleStatus.DefaultTitle:
                                return '元のタイトルです。';
                            case TitleStatus.NotExistTitle:
                                return 'このタイトルは使用可能です。';
                            case TitleStatus.NotEntered:
                                return '未入力';
                            case TitleStatus.ExistTitle:
                                return 'このタイトルは既に使用されています。変更してください。';
                            case TitleStatus.WhitespaceOnly:
                                return '空白文字のみで構成されたタイトルは使用できません。';
                        }
                    }()}
                </p>
            </>
        } label_width={label_width} />
    );
}

function LimitedTextArea(props: { labelName: string, required?: boolean, markdown?: boolean, id: string, maxLength: number, setter: (val: string) => void }) {
    const [length, setLength] = useState(0);

    return (
        <LabelInput label={
            <label htmlFor={props.id}>
                {props.labelName}
                {props.required ? ' *必須' : null}
                <br />
                {props.markdown ? <>マークダウン形式<br /></> : null}
                {length} / {props.maxLength}
            </ label>
        } input={
            <>
                <LargeTextArea id={props.id} onChange={(event) => {
                    setLength(event.target.value.length);
                    props.setter(event.target.value);
                }} maxLength={props.maxLength} />
            </>
        } label_width={label_width} />
    );
}

const label_width = 5;

function QuestionInputs(props: {
    question: QuestionBean,
    setQuestion: React.Dispatch<React.SetStateAction<QuestionBean>>,
    defaultTitle?: string,
    titleStatus: TitleStatus,
    setTitleStatus: React.Dispatch<React.SetStateAction<TitleStatus>>
}) {
    const [viewPassword, setViewPassword] = useState('');
    const [viewPasswordCheck, setViewPasswordCheck] = useState('');
    const [privateAnswerMode, setPrivateAnswerMode] = useState(false);
    const [releaseFlag, setReleaseFlag] = useState(false);

    return (
        <div id="question-inputs">
            <QuestionTitleInput
                setter={function (val: string) { props.setQuestion({ ...props.question, question_title: val }); }}
                defaultTitle={props.defaultTitle}
                titleStatus={props.titleStatus}
                setTitleStatus={props.setTitleStatus}
            />

            <LimitedTextArea
                labelName={'問題文'}
                id={'question_text'}
                maxLength={2000}
                required={true}
                markdown={true}
                setter={function (val: string) { props.setQuestion({ ...props.question, question_text: val }); }}
            />

            <LimitedTextArea
                labelName={'入力形式'}
                id={'input'}
                maxLength={1000}
                setter={function (val: string) { props.setQuestion({ ...props.question, input: val }); }}
            />

            <LimitedTextArea
                labelName={'入力形式の説明'}
                id={'input_explain'}
                maxLength={1000}
                markdown={true}
                setter={function (val: string) { props.setQuestion({ ...props.question, input_explain: val }); }}
            />

            <LimitedTextArea
                labelName={'出力形式'}
                id={'output'}
                maxLength={1000}
                setter={function (val: string) { props.setQuestion({ ...props.question, output: val }); }}
            />

            <LimitedTextArea
                labelName={'出力形式の説明'}
                id={'output_explain'}
                maxLength={1000}
                markdown={true}
                setter={function (val: string) { props.setQuestion({ ...props.question, output_explain: val }); }}
            />

            <hr />
            <h3>入出力例を入力</h3>
            <Row>
                <Col>
                    <p>
                        入出力例は提出前の実行確認に利用されます。最大3件登録できます。<br />
                        <span className="double-quotation">入力例</span> <span className="double-quotation">出力例</span> の末尾は改行で終えてください。改行で終えなかった場合には、自動で改行が挿入されます。<br />
                        同じ番号の<span className="double-quotation">入力例</span> <span className="double-quotation">出力例</span> <span className="double-quotation">入出力例の補足</span> を全て記述しなかった場合、以降の入出力例は無視されます。
                    </p>
                </Col>
            </Row>

            {
                function () {
                    const list: Array<JSX.Element> = [];
                    for (let i = 1; i <= 3; i++) {
                        list.push(
                            <div key={i}>
                                <LimitedTextArea
                                    labelName={'入力例' + i}
                                    id={'inputs_' + i}
                                    maxLength={1000}
                                    setter={function (val: string) {
                                        const newInputs = props.question.inputs;
                                        newInputs[i - 1] = val === '' ? null : val;
                                        props.setQuestion({ ...props.question, inputs: newInputs });
                                    }}
                                />

                                <LimitedTextArea
                                    labelName={'出力例' + i}
                                    id={'outputs_' + i}
                                    maxLength={1000}
                                    setter={function (val: string) {
                                        const newOutputs = props.question.outputs;
                                        newOutputs[i - 1] = val === '' ? null : val;
                                        props.setQuestion({ ...props.question, outputs: newOutputs });
                                    }}
                                />

                                <LimitedTextArea
                                    labelName={'入出力例' + i + 'の補足'}
                                    id={'io_explain_' + i}
                                    maxLength={1000}
                                    markdown={true}
                                    setter={function (val: string) {
                                        const newIo_explain = props.question.io_explain;
                                        newIo_explain[i - 1] = val === '' ? null : val;
                                        props.setQuestion({ ...props.question, io_explain: newIo_explain });
                                    }}
                                />
                            </div>
                        );
                    }
                    return list;
                }()
            }

            <hr />

            <h3>オプション</h3>
            <LabelInput
                label={<label htmlFor="language_designation">言語指定</label>}
                input={
                    <select id="language_designation" name="language_designation" onChange={function (event) {
                        props.setQuestion({ ...props.question, language_designation: event.target.value === 'null' ? null : Number(event.target.value) });
                    }}>
                        <option value="null">言語指定なし</option>
                        {Languages.map((lang) => { return <option key={lang.language_id} value={lang.language_id}>{lang.language_name}</option> })}
                    </select>
                }
                label_width={label_width}
            />

            <LabelInput
                label={<label htmlFor="view_password">問題表示パスワード</label>}
                input={<input type="password" id="view_password" name="view_password" autoComplete="one-time-code" onChange={function (event) { setViewPassword(event.target.value); }} />}
                label_width={label_width}
            />

            <LabelInput
                label={<label htmlFor="view_password_check">問題表示パスワード（確認）</label>}
                input={<input type="password" id="view_password_check" name="view_password_check" autoComplete="one-time-code" onChange={function (event) { setViewPasswordCheck(event.target.value); }} />}
                label_width={label_width}
            />

            <LabelInput
                label={<label htmlFor="private_answer_mode">解答非公開モード</label>}
                input={
                    <p>
                        <input type="checkbox" id="private_answer_mode" name="private_answer_mode" onChange={function (event) { setPrivateAnswerMode(event.target.checked); }} />
                        <label htmlFor="private_answer_mode">チェックをすると、他の人が提出した解答を見られなくなります。</label>
                    </p>
                }
                label_width={label_width}
            />

            <LabelInput
                label={<label htmlFor="release_flag">問題を公開する</label>}
                input={
                    <p>
                        <input type="checkbox" id="release_flag" name="release_flag" onChange={function (event) { setReleaseFlag(event.target.checked); }} />
                        <label htmlFor="release_flag">チェックしなければ問題一覧に表示されず、問題IDを知っていても表示できません。</label>
                    </p>
                }
                label_width={label_width}
            />

            <hr />

            <h3>チェックリスト</h3>
            <ul id="check-list">
                {
                    function () {
                        switch (props.titleStatus) {
                            case TitleStatus.NotEntered:
                                return <li className="warning"><SmoothScrollLink toID="question_title">タイトル</SmoothScrollLink>を記述してください。</li>;
                            case TitleStatus.ExistTitle:
                                return <li className="warning"><SmoothScrollLink toID="question_title">タイトル</SmoothScrollLink>が既に使用されています。変更してください。</li>;
                            case TitleStatus.WhitespaceOnly:
                                return <li className="warning"><SmoothScrollLink toID="question_title">タイトル</SmoothScrollLink>を空白文字のみで構成することはできません。</li>;
                        }
                    }()
                }
                {props.question.question_text === '' ? <li className="warning"><SmoothScrollLink toID="question_text">問題文</SmoothScrollLink>を記述してください。</li> : null}
                {props.question.input === '' ? <li><SmoothScrollLink toID="input">入力形式</SmoothScrollLink>が記述されていません。入力が無い場合、入力値による分岐が無く、正解出力パターンが1つのみの問題になります。</li> : null}
                {props.question.input_explain === '' ? (
                    <li><SmoothScrollLink toID="input_explain">入力形式の説明</SmoothScrollLink>が記述されていません。
                        {props.question.input === '' ? <>入力が無い問題の場合は、入力が無い旨を説明することが推奨されます。</> : <><SmoothScrollLink toID="input">入力形式</SmoothScrollLink>に対する説明を記述してください。</>}
                    </li>
                ) : null}
                {props.question.output === '' ? <li><SmoothScrollLink toID="output">出力形式</SmoothScrollLink>が記述されていません。正解出力の判定ができません。</li> : null}
                {props.question.output_explain === '' ? (
                    <li>
                        <SmoothScrollLink toID="output_explain">出力形式の説明</SmoothScrollLink>が記述されていません。
                        {props.question.input === '' ? <>出力が無い問題の場合は、出力が無い旨を説明することが推奨されます。</> : <><SmoothScrollLink toID="question_title">出力形式</SmoothScrollLink>に対する説明を記述してください。</>}
                    </li>
                ) : null}

                {
                    function () {
                        const list: Array<JSX.Element> = [];
                        let keycnt = 0;
                        for (let i = 0; i < 3; i++) {
                            const viewidx = i + 1;

                            if (props.question.inputs[i] === null) {
                                list.push(<li key={keycnt++}><SmoothScrollLink toID={'inputs_' + viewidx}>入力例{viewidx}</SmoothScrollLink>が記述されていません。</li>);
                            } else {
                                if (!(props.question.inputs[i] as string).endsWith('\n')) {
                                    list.push(<li key={keycnt++}><SmoothScrollLink toID={'inputs_' + viewidx}>入力例{viewidx}</SmoothScrollLink>の末尾を改行で終えてください。改行を含めず登録した場合、自動で改行が挿入されます。</li>);
                                }
                            }

                            if (props.question.outputs[i] === null) {
                                list.push(<li key={keycnt++}><SmoothScrollLink toID={'outputs_' + viewidx}>出力例{viewidx}</SmoothScrollLink>が記述されていません。</li>);
                            } else {
                                if (!(props.question.outputs[i] as string).endsWith('\n')) {
                                    list.push(<li key={keycnt++}><SmoothScrollLink toID={'outputs_' + viewidx}>出力例{viewidx}</SmoothScrollLink>の末尾を改行で終えてください。改行を含めず登録した場合、自動で改行が挿入されます。</li>);
                                }
                            }

                            if (props.question.io_explain[i] === null) {
                                list.push(<li key={keycnt++}><SmoothScrollLink toID={'io_explain_' + viewidx}>入出力例{viewidx}の補足</SmoothScrollLink>が記述されていません。</li>);
                            }
                        }
                        return list;
                    }()
                }

                {
                    function () {
                        const list: Array<JSX.Element> = [];
                        let keycnt = 0
                        for (let i = 0; i < 3; i++) {
                            if (props.question.inputs[i] === null && props.question.outputs[i] === null && props.question.io_explain[i] === null) {
                                const viewidx = i + 1;
                                list.push(<li key={keycnt++}><SmoothScrollLink toID={'inputs_' + viewidx}>入出力例{viewidx}</SmoothScrollLink>が全て記述されていません。以降の入出力例は全て無視され、登録されません。記述している場合は1から順に記述してください。</li>);
                                if (i === 0) {
                                    list.push(<li key={keycnt++}><SmoothScrollLink toID={'inputs_' + viewidx}>入出力例</SmoothScrollLink>が1件も登録されません。解答者は、提出前の実行確認ができません。</li>);
                                }
                                break;
                            }
                        }
                        return list;
                    }()
                }

                {viewPassword === '' ? <li><SmoothScrollLink toID="view_password">問題表示パスワード</SmoothScrollLink>が設定されていません。期末試験等に利用する場合は、必ず設定してください。</li> : null}
                {viewPassword !== viewPasswordCheck ? <li><SmoothScrollLink toID="view_password">問題表示パスワード</SmoothScrollLink>と<SmoothScrollLink toID="view_password_check">問題表示パスワード（確認）</SmoothScrollLink>が一致しません。</li> : null}
                {privateAnswerMode === false ? <li><SmoothScrollLink toID="private_answer_mode">解答非公開モード</SmoothScrollLink>ユーザは他の人が提出した解答を表示できます。期末試験等に利用する場合は、必ずチェックをつけてください。</li> : null}
                <li className="warning">{releaseFlag === true ? (
                    <>問題は公開され、問題一覧に表示されます。表示される項目は、<span className="double-quotation">タイトル</span><span className="double-quotation">言語指定</span><span className="double-quotation">表示パスワードの有無</span><span className="double-quotation">投稿者</span><span className="double-quotation">投稿日時</span>です。</>
                ) : (
                    <>問題は公開されず、下書きとして保存されます。</>
                )}</li>
            </ul>

            <hr />

            <input type="submit" value="登録する" className="btn btn-full" />
        </div>
    );
}

export default QuestionInputs;