import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import Loading from "../errors/Loading";
import NotFoundError from "../errors/NotFoundError";
import LabelInput from "../global_components/LabelInput";
import { LargeTextArea } from "../global_components/LargeTextArea";

const label_width = 5;
const maxLength = 1000;

function LimitedTextArea(props: { labelName: string, id: string, defaultValue: string | null }) {
    const [length, setLength] = useState(0);

    return (
        <LabelInput label={
            <label htmlFor={props.id}>
                {props.labelName}
                <br />
                {length} / {maxLength}
            </ label>
        } input={
            <>
                <LargeTextArea id={props.id} onChange={(event) => {
                    setLength(event.target.value.length);
                }} maxLength={maxLength} defaultValue={props.defaultValue} />
            </>
        } label_width={label_width} />
    );
}

function EditQuestionIO() {
    const params = useParams();
    const question_id = params.question_id;
    const navigate = useNavigate();
    const [IO, setIO] = useState<{ input_judge: null | Array<null | string>, output_judge: null | Array<null | string> }>();

    useEffect(() => {
        type EditQuestionIOResponse = ResponseBase & {
            data: {
                input_judge: null | Array<null | string>,
                output_judge: null | Array<null | string>,
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.editQuestionIO) + '/' + question_id).then((res: EditQuestionIOResponse) => {
            receiveResponse(res, navigate, function () {
                setIO({ input_judge: res.data.input_judge, output_judge: res.data.output_judge });
            });
        }).catch(catchError);
    }, []);

    if (IO === undefined) {
        return (
            <>
                <Loading />
            </>
        );
    }

    if (IO === null) {
        return (
            <>
                <NotFoundError />
            </>
        );
    }

    return (
        <>
            <form onSubmit={
                function (event: AnyFormEvent) {
                    event.preventDefault();




                    type EditQuestionResponse = ResponseBase & {
                        data: {
                            status: boolean
                        }
                    };
                    axios.post(generateAPI(API.Manager._, API.Manager.editQuestionIO) + '/' + question_id, { input_judge: null, output_judge: null }).then((res: EditQuestionResponse) => {
                        receiveResponse(res, navigate, function () {
                            console.log(res);
                        });
                    }).catch(catchError);
                }}>
                {function () {
                    let nullFlag = false;
                    if (IO.input_judge === null) {
                        nullFlag = true;
                    }

                    const list: Array<JSX.Element> = [];

                    for (let i = 0; i < 10; i++) {
                        const viewIdx = i + 1;
                        if (nullFlag === false && IO.input_judge![i] === null && IO.output_judge![i] === null) {
                            nullFlag = true;
                        }
                        list.push(
                            <Fragment key={i}>
                                <h3>入出力値{viewIdx}</h3>
                                <LimitedTextArea
                                    labelName={'入力値' + viewIdx}
                                    id={'input_judge_' + viewIdx}
                                    defaultValue={nullFlag === true ? null : IO.input_judge![i]}
                                />
                                <LimitedTextArea
                                    labelName={'想定出力値' + viewIdx}
                                    id={'output_judge_' + viewIdx}
                                    defaultValue={nullFlag === true ? null : IO.output_judge![i]}
                                />
                            </Fragment>
                        );
                    }
                    return list;
                }()}
                <input type="submit" value="決定" />
            </form>
        </>
    );
}

export default EditQuestionIO;