import { Outlet } from "react-router-dom";
import { Authority } from "../../constants/Authority";
import PrivatePage from "../global_components/PrivatePage";

function ManagerUniform() {
    return (
        <>
            <div id="manager-page">
                <PrivatePage permit={[Authority.Admin.id, Authority.Manager.id]} outlet={<Outlet />} />
            </div>
        </>
    );
}

export default ManagerUniform;