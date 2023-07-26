import { auth } from "../firebase-config";

export const RightNav = ({signUserOut, isAuth}) => {
    return (
        <div id="right-nav" className="nav left-border">
           { isAuth ? 
           (<>
           <div className="user-info">
                <img className="profile-pic" src={auth.currentUser.photoURL}  alt="user pic" />
                <p>{auth.currentUser.displayName}</p>
           </div>
           <button onClick={signUserOut}>Sign Out</button>
           </>)
           : <></>} 
        </div>
    );
}