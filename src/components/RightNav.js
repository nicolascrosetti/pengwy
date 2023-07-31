import { auth } from "../firebase-config";

export const RightNav = ({signUserOut, isAuth}) => {
    return (
        <div id="right-nav" className="nav left-border">
           { isAuth ? 
           (<div className="section-container gap-30">
                <div className="right-nav-box">
                     <div className="user-info">
                          <img className="profile-pic" src={auth.currentUser.photoURL}  alt="user pic" />
                          <p>{auth.currentUser.displayName}</p>
                     </div>
                     <button onClick={signUserOut}>Sign Out</button>
                </div>
                <div className="right-nav-box section-container-start">
                    <h3>get verified</h3>
                    <p>Subscribe to unlock more features</p>
                    <button>get verified</button>
                </div>
           </div>)
           : <></>} 
        </div>
    );
}