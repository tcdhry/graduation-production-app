import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { Styles } from "../../constants/Styles";
import useCookieWrap from "../global_components/useCookieWrap";

function SelectStyle() {
    const [selectedStyle, setStyle] = useCookieWrap();

    return (
        <>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const style_id = event.nativeEvent.submitter.name;
                setStyle(style_id!);// cookieの更新
                // サーバへの通信、スタイルの更新はApp.tsxのuseEffectに任せる。
            }}>
                {Styles.map((style) => <input key={style.style_id} type="submit" value={style.style_name} name={style.style_id} className="btn" />)}
            </form>
        </>
    );
}

export default SelectStyle;