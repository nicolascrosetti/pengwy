import { useEffect, useState } from "react";
import { Peng } from "./Peng";
import { auth } from "../firebase-config";

export const Profile = ({user, pengs, followUser, unfollowUser, checkIfFollowed, profileViewOn}) => {
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        checkIfFollowed(setIsFollowed, user.id);
    }, [profileViewOn]);

    let pengsAmount = 0;
    pengs.forEach((peng) => {
        pengsAmount++;
    });

    const followClickHandler = () => {
        if(isFollowed){
            unfollowUser(auth.currentUser.uid, user.id);
            setIsFollowed(false);
        }else{
            followUser(auth.currentUser.uid, user.id);
            setIsFollowed(true);
        }
    } 

    return (
        <>
            <div className="user-box">
                <img src={user.photoUrl} alt="profile-pic" />
                <div>
                    <h2>{user.name}</h2>
                    <p className="pengs-amount">{pengsAmount} pengs</p>
                     {isFollowed ? (<button id="unfollow" onClick={followClickHandler}>Unfollow</button>) : <button id="follow" onClick={followClickHandler}>Follow</button>} 
                </div>
            </div>
            <div id="user-pengs-title" className="bottom-border">
                 <h4>Pengs</h4>
            </div>
            { pengs.map((peng) => { return <Peng key={peng.id} peng={peng} /> } ) }
        </>
    );
}