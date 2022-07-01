import { useState } from "react";
import { Peng } from "./Peng";

export const Profile = ({user, pengs}) => {
    let pengsAmount = 0;
    pengs.forEach((peng) => {
        pengsAmount++;
    });


    return (
        <>
            <div className="user-box">
                <img src={user.photoUrl} alt="profile-pic" />
                <div>
                    <h2>{user.name}</h2>
                    <p className="pengs-amount">{pengsAmount} pengs</p>
                </div>
            </div>
            <div id="user-pengs-title" className="bottom-border">
                 <h4>Pengs</h4>
            </div>
            { pengs.map((peng) => { return <Peng key={peng.id} peng={peng} /> } ) }
        </>
    );
}