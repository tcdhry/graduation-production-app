import { BiEdit } from "react-icons/bi";
import { BsListUl } from "react-icons/bs";
import { TbFilePlus, TbFiles } from "react-icons/tb";
import { URL, generateURL } from "../../constants/URL";
import IndexLink from "../global_components/IndexLink";

function ManagerIndex() {
    return (
        <nav id="index-nav">
            <IndexLink to={generateURL(URL.Manager._, URL.Manager.postQuestion)} value='問題投稿' icon={<BiEdit />} />
            <IndexLink to={generateURL(URL.Manager._, URL.Manager.viewMyQuestions)} value='自分の問題一覧' icon={<BsListUl />} />
            <IndexLink to={generateURL(URL.Manager._, URL.Manager.postExam)} value='試験投稿' icon={<TbFilePlus />} />
            <IndexLink to={generateURL(URL.Manager._, URL.Manager.viewMyExams)} value='自分の試験一覧' icon={<TbFiles />} />
        </nav>
    );
}

export default ManagerIndex;