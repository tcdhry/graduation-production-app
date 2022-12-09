import { Outlet } from "react-router-dom";
import { Authority } from "../../constants/Authority";
import PrivatePage from "../global_components/PrivatePage";

function AdminUniform() {
    return (
        <>
            <div id="admin-page">
                <PrivatePage permit={[Authority.Admin.id]} outlet={<Outlet />} />
            </div>
        </>
    );
}

export default AdminUniform;