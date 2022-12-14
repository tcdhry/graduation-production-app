import { Questions } from "../../beans/QuestionBean";
import { generateURL, URL } from "../../constants/URL";
import QuestionThumbnailCard from "./QuestionThumbnailCard";

function QuestionsListView(props: { questions: Questions }) {
    const toURL = generateURL(URL.User._, URL.User.viewQuestion);
    const questionsURL = generateURL(URL.User._, URL.User.viewQuestions);
    return (
        <div id="questions-list">
            {
                function () {
                    const list: Array<JSX.Element> = [];
                    let i = 0;
                    props.questions.forEach((question) => {
                        list.push(<QuestionThumbnailCard key={i++} question={question} toURL={toURL} questionsURL={questionsURL} />)
                    });
                    return list;
                }()
            }
        </div>
    );
}

export default QuestionsListView;