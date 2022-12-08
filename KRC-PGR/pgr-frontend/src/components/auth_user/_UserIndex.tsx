import { generateURL, URL } from "../../constants/URL";
import IndexLink from "../global_components/IndexLink";
import { FaUserAlt } from "react-icons/fa";
import { BsListUl } from "react-icons/bs";
import { FaPalette } from "react-icons/fa";
import { GiCrownedSkull } from "react-icons/gi";

function UserIndex() {
    return (
        <>
            <nav id="index-nav">
                <IndexLink to={generateURL(URL.User._, URL.User.profile)} value={'プロフィール'} icon={<FaUserAlt />} />
                <IndexLink to={generateURL(URL.User._, URL.User.viewQuestions)} value={'問題リスト'} icon={<BsListUl />} />
                <IndexLink to={generateURL(URL.User._, URL.User.selectStyle)} value={'色テーマ選択'} icon={<FaPalette />} />
                <IndexLink to={generateURL(URL.User._, URL.User.ranking)} value={'ランキング'} icon={<GiCrownedSkull />} />
            </nav>
        </>
    );
}

export default UserIndex;