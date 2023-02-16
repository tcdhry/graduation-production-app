import { useNavigate } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { generateURL, URL } from "../../constants/URL";
import { Row, Col } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";

function ViewExamSearch() {
    const navigate = useNavigate();
    
    return (
        <>
            <h2>試験検索</h2>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                navigate(generateURL(URL.User._, URL.User.viewExam) + '/' + splitID(event.target.exam_id.value));
            }}>
                <LabelInput
                    label={<label>共有されたURL<br />または試験IDを入力</label>}
                    input={<><input type="text" required id="exam_id" /></>}
                    label_width={5}
                />

                <Row>
                    <Col>
                        <input type="submit" value="入力後にクリック" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}

export default ViewExamSearch;

function splitID(inputValue: string) {
    const l = inputValue.split('/');
    return l[l.length - 1];
}