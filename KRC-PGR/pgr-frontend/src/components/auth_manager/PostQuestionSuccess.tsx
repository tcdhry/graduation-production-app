import { useParams } from "react-router-dom";

function PostQuestionSuccess() {
    const params = useParams<{ question_id: string }>();

    return (
        <>
            <h2>問題の登録が完了しました。</h2>
            <p>
                問題ID：{params.question_id}<br />
                続けて、採点用データを追加しますか？
            </p>
        </>
    );
}

export default PostQuestionSuccess;