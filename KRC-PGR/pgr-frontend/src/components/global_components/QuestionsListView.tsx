import { Questions } from "../../beans/QuestionBean";
import { generateURL, URL } from "../../constants/URL";
import QuestionThumbnailCard from "./QuestionThumbnailCard";

function QuestionsListView(props: { questions: Questions, toURL: string, myQuestions?: boolean }) {
    const questionsURL = generateURL(URL.User._, URL.User.viewQuestions);
    return (
        <div id="questions-list">
            {
                function () {
                    const list: Array<JSX.Element> = [];
                    let i = 0;
                    props.questions.forEach((question) => {
                        list.push(<QuestionThumbnailCard key={i++} question={question} toURL={props.toURL} questionsURL={questionsURL} myQuestion={props.myQuestions} />)
                    });
                    return list;
                }()
            }
        </div>
    );
}

export default QuestionsListView;