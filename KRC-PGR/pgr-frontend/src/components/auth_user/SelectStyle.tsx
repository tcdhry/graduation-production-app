import { Fragment } from "react";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { Styles } from "../../constants/Styles";
import { Col, Row } from "../global_components/24ColLayout";
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
                <Row>
                    <Col width={12} offset={6}>
                        {Styles.map((style) => <Fragment key={style.style_id}><input type="submit" value={style.style_name} name={style.style_id} className="btn btn-full" /><br /><br /></Fragment>)}
                    </Col>
                </Row>
            </form>
        </>
    );
}

export default SelectStyle;