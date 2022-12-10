import React from "react";
import LogoutForm from "../LogoutForm/LogoutForm";

function ProfileForm({ username, disconnect }) {
    return (
        <div className="profile">
            User: {username}
            <LogoutForm disconnect={disconnect} />
        </div>
    );
}

export default ProfileForm;
