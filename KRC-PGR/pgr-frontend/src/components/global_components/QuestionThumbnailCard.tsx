import { Link } from "react-router-dom";
import { QuestionThumbnail } from "../../beans/QuestionBean";
import { getLanguageName } from "../../constants/Language";
import { generateURL, URL } from "../../constants/URL";

function QuestionThumbnailCard(props: { question: QuestionThumbnail, toURL: string, questionsURL: string, myQuestion?: boolean }) {
    return (
        <>
            <section className="question-card">
                <Link to={props.toURL + '/' + props.question.question_id} className="qt-head text-link visited">
                    <h3>
                        <span className="qt-title">
                            {props.question.question_title}
                            {props.question.release_flag === false ? (<>【未公開】</>) : null}
                        </span>
                        <span className="qt-timestamp">
                            {props.question.insert_timestamp}
                        </span>
                    </h3>
                </Link>
                <div className="qt-poster">
                    <p>投稿者</p>
                    <Link to={props.questionsURL + '?poster_id=' + props.question.user_id} className="text-link">
                        {props.question.user_view_name}
                    </Link>
                </div>
                <div className="qt-status">
                    <div>
                        <div>
                            {
                                props.question.password_required === true
                                    ? (<><span>要</span>パスワード</>)
                                    : (<>パスワード不要</>)
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            {
                                props.question.language_designation === null
                                    ? (<>言語指定なし</>)
                                    : (<><span>{getLanguageName(props.question.language_designation)}</span>限定</>)
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            {
                                props.question.scoring
                                    ? (<><span>採点</span>あり</>)
                                    : (<>採点なし</>)
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            {
                                props.question.answered
                                    ? (<>解答提出済み</>)
                                    : (<><span>未</span>解答</>)
                            }
                        </div>
                    </div>
                </div>
                {
                    props.myQuestion === true ? (<MyQuestionLinks question={props.question} />) : (null)
                }
            </section>
        </>
    );
}

export default QuestionThumbnailCard;

function MyQuestionLinks(props: { question: QuestionThumbnail }) {
    return (
        <>
            <div className="my-question-links">
                <div>
                    <Link to={generateURL(URL.Manager._, URL.Manager.editQuestion) + '/' + props.question.question_id} className="text-link">問題編集</Link>
                </div>
                <div>
                    <Link to={generateURL(URL.Manager._, URL.Manager.editQuestionIO) + '/' + props.question.question_id} className="text-link">採点用データ編集</Link>
                </div>
                <div>
                    <Link to={generateURL(URL.Manager._, URL.Manager.viewAnswers) + '/' + props.question.question_id} className="text-link">提出された解答</Link>
                </div>
                <div>
                    <Link to={generateURL(URL.User._, URL.User.viewQuestion) + '/' + props.question.question_id} className="text-link">ユーザとして解答する</Link>
                </div>
            </div>
        </>
    );
}