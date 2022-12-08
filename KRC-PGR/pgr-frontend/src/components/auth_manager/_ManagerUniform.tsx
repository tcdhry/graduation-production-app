import { Outlet } from "react-router-dom";

function ManagerUniform() {
    return (
        <>
            <div id="manager-page">
                <Outlet />
            </div>
        </>
    );
}

export default ManagerUniform;