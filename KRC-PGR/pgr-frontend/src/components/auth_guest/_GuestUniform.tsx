import { Outlet } from "react-router-dom";

function GuestUniform() {
    return (
        <>
            <div id="guest-page">
                <Outlet />
            </div>
        </>
    );
}

export default GuestUniform;