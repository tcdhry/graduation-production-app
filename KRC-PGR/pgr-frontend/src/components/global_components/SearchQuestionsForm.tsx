import { useNavigate } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { Languages } from "../../constants/Language";
import LabelInput, { LabelCheckbox, LabelRadio } from "./LabelInput";
import queryString from "query-string";

function tfToString(checkboxList: Array<HTMLInputElement>) {
    let rtn = '';
    let falseFlag = false;
    checkboxList.forEach((checkbox) => {
        if (checkbox.checked === true) {
            rtn += checkbox.value;
        } else {
            falseFlag = true;
        }
    });
    return falseFlag ? rtn : undefined;
}

const label_width = 5;
function SearchQuestionsForm(props: {}) {
    const navigate = useNavigate();
    /**
     * TODO
     * URL直打ちした際の入力値の引継ぎが想定以上に難しいため未実装とする。
     */
    return (
        <>
            <form id="search-questions-form" onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const form = event.target;
                const title = form.title.value === '' ? undefined : form.title.value;
                const poster_id = form.poster_id.value === '' ? undefined : form.poster_id.value;
                let errorMessage: string = '';

                // const language = (
                //     (Array.from(form.language) as Array<HTMLInputElement>)
                //         .filter((checkbox) => { return checkbox.checked; })
                //         .map((checkbox) => { return checkbox.value; })
                //         .join('.')
                // );

                let language: string | undefined = '';
                let falseFlag = false;
                form.language.forEach((checkbox: HTMLInputElement) => {
                    if (checkbox.checked === true) {
                        language += '.' + checkbox.value;
                    } else {
                        //  未チェックが1つでもあれば立てる
                        falseFlag = true;
                    }
                });
                if (!falseFlag) {
                    language = undefined;
                } else if (language !== '') {
                    language = language.substring(1);
                } else {
                    // 言語未選択
                    errorMessage += '・言語指定が1つも選択されていません。\n';
                }

                const scoring = tfToString(form.scoring);
                if (scoring === '') {
                    // 採点未選択
                    errorMessage += '・採点が1つも選択されていません。\n';
                }

                const answered = tfToString(form.answered);
                if (answered === '') {
                    // 提出済み未選択
                    errorMessage += '・解答提出が1つも選択されていません。\n';
                }

                const password = tfToString(form.password);
                if (password === '') {
                    // パスワード未選択
                    errorMessage += '・パスワードが1つも選択されていません。\n';
                }

                if (errorMessage !== '') {
                    alert(errorMessage);
                    return;
                }

                const sort = form.sort.value === 'new' ? undefined : 'old';

                const params = { title: title, poster_id: poster_id, language: language, scoring: scoring, answered: answered, password: password, sort: sort };
                navigate('?' + queryString.stringify(params));
            }}>
                <LabelInput
                    label={<><label htmlFor="title">問題タイトル</label></>}
                    input={<><input type="text" id="title" name="title" maxLength={50} /></>}
                    label_width={label_width}
                />
                <LabelInput
                    label={<><label htmlFor="poster_id">投稿者ID</label></>}
                    input={<><input type="text" id="poster_id" name="poster_id" /></>}
                    label_width={label_width}
                />
                <LabelInput
                    label={<><label>言語指定</label></>}
                    input={
                        <>
                            <LabelCheckbox
                                value={'null'}
                                id={'language-null'}
                                name={'language'}
                                labelText={'指定なし'}
                                defaultChecked={true}
                            />
                            {
                                function () {
                                    const list: Array<JSX.Element> = [];
                                    Languages.forEach((language) => {
                                        list.push(
                                            <LabelCheckbox
                                                key={language.language_id}
                                                value={String(language.language_id)}
                                                id={'language-' + language.language_id}
                                                name={'language'}
                                                labelText={language.language_name}
                                                defaultChecked={true}
                                            />
                                        );
                                    });
                                    return list;
                                }()
                            }
                        </>
                    }
                    label_width={label_width}
                />
                <LabelInput
                    label={<><label>採点</label></>}
                    input={
                        <>
                            <LabelCheckbox value={'t'} id={'scoring-true'} name={'scoring'} labelText={'あり'} defaultChecked={true} />
                            <LabelCheckbox value={'f'} id={'scoring-false'} name={'scoring'} labelText={'なし'} defaultChecked={true} />
                        </>
                    }
                    label_width={label_width}
                />
                <LabelInput
                    label={<><label>解答提出</label></>}
                    input={
                        <>
                            <LabelCheckbox value={'t'} id={'answered-true'} name={'answered'} labelText={'提出済み'} defaultChecked={true} />
                            <LabelCheckbox value={'f'} id={'answered-false'} name={'answered'} labelText={'未提出'} defaultChecked={true} />
                        </>
                    }
                    label_width={label_width}
                />
                <LabelInput
                    label={<><label>表示パスワード</label></>}
                    input={
                        <>
                            <LabelCheckbox value={'t'} id={'password-true'} name={'password'} labelText={'要'} defaultChecked={true} />
                            <LabelCheckbox value={'f'} id={'password-false'} name={'password'} labelText={'不要'} defaultChecked={true} />
                        </>
                    }
                    label_width={label_width}
                />
                <LabelInput
                    label={<><label>並び替え</label></>}
                    input={
                        <>
                            <LabelRadio value={'new'} id={'sort-true'} name={'sort'} labelText={'新規'} defaultChecked={true} />
                            <LabelRadio value={'old'} id={'sort-false'} name={'sort'} labelText={'旧'} defaultChecked={false} />
                        </>
                    }
                    label_width={label_width}
                />
                <input type="submit" className="btn btn-full" value="検索" />
            </form>
        </>
    );
}

export default SearchQuestionsForm;