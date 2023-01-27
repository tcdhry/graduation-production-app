import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";

type StyleBean = {
    [key: string]: string
};

function ColorInputTd(props: { defaultColor: string, id: string }) {
    const [color, setColor] = useState(props.defaultColor);
    return (
        <td>
            <input type="text" style={{ background: color }} readOnly tabIndex={99999} />
            <input type="text" defaultValue={props.defaultColor} onChange={function (event) { setColor(event.target.value); }} id={props.id} />
        </td >
    );
}

function StyleManage() {
    const navigate = useNavigate();
    const [styles, setStyles] = useState<Array<StyleBean>>([]);

    useEffect(() => {
        type GetStylesResponse = ResponseBase & {
            data: {
                styles: Array<StyleBean>
            }
        };
        axios.get(generateAPI(API.Admin._, API.Admin.getStyles)).then((res: GetStylesResponse) => {
            receiveResponse(res, navigate, function () {
                setStyles(res.data.styles);
            });
        }).catch(catchError);
    }, [navigate]);

    return (
        <div id="style-manage">
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const style_id = event.nativeEvent.submitter.name;
                const params: { [key: string]: string } = { style_id: style_id! };
                Object.keys(styles[0]).slice(1).forEach((key) => {
                    params[key] = event.target.querySelector('#' + style_id + '-' + key).value;
                });

                axios.post(generateAPI(API.Admin._, API.Admin.updateStyle), params).then((res) => {
                    receiveResponse(res, navigate, function () {
                        alert(style_id + 'を更新しました。')
                    });
                }).catch(catchError);
            }}>
                <table id="styles-table">
                    <thead>
                        <tr>
                            {
                                styles.length === 0 ? (
                                    <></>
                                ) : (
                                    <>
                                        <th>style-id(変更不可)</th>
                                        {Object.keys(styles[0]).slice(1).map((key) => <th key={key}>{key.replaceAll('_', '-')}</th>)}
                                    </>
                                )
                            }
                            <th>更新</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            styles.map((style) => {
                                return (
                                    <tr key={style.style_name}>
                                        <td>
                                            <input type="text" readOnly tabIndex={99999} />
                                            <input type="text" defaultValue={style.style_id} readOnly />
                                        </td>
                                        {
                                            Object.keys(style).slice(1).map((key) => {
                                                return (
                                                    <ColorInputTd defaultColor={style[key]} id={style.style_id + '-' + key} key={style.style_id + '-' + key} />
                                                );
                                            })
                                        }
                                        <td>
                                            <input type="submit" value="更新" className="btn btn-full" name={style.style_id} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </form>
        </div >
    );
}

export default StyleManage;