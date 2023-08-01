import { useState } from "react";
import { auth } from "../firebase-config";

const closeIcon = require('../icons/close.png');

export const DrawerNav = ({setDrawerNavViewOn, signUserOut, isAuth}) => {
    //Handlers
    const handleCloseClick = () => {
        setDrawerNavViewOn(false);
    }
    const handleModalClick = () => {
        setDrawerNavViewOn(false);
    }
    const handleSignOutClick = () => {
        signUserOut();
        setDrawerNavViewOn(false);
    }

    return(
        <>
        <div className="modal-background" onClick={handleModalClick}>
        </div>
        <div className="drawer-nav relative">
            <div> 
                <img src={closeIcon} alt="close"  className='icon-drawer' onClick={handleCloseClick} />
            </div>
            { isAuth ?
            (<div className="right-nav-box">
                     <div className="user-info">
                          <img className="profile-pic" src={auth.currentUser.photoURL}  alt="user pic" />
                          <p>{auth.currentUser.displayName}</p>
                     </div>
                     <button onClick={handleSignOutClick}>Sign Out</button>
            </div>) : null
            }               
        </div>
    </>
    );
}