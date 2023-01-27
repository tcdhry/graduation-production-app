import { Link, useParams } from "react-router-dom";
import { generateURL, URL } from "../../constants/URL";

function PostQuestionSuccess() {
    const params = useParams<{ question_id: string }>();

    return (
        <>
            <h2>問題の登録が完了しました。</h2>
            <p>
                問題ID：{params.question_id}<br />
                続けて、採点用データを追加しますか？
                <Link to={generateURL(URL.Manager._, URL.Manager.editQuestionIO) + '/' + params.question_id} className="btn btn-full">採点用データを追加</Link>
            </p>
        </>
    );
}

export default PostQuestionSuccess;