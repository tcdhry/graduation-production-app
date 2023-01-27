import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { Styles } from "../../constants/Styles";
import useCookieWrap from "../global_components/useCookieWrap";

function SelectStyle() {
    const setStyle = useCookieWrap()[1];

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