import { auth } from "../firebase-config";

export const RightNav = ({signUserOut, isAuth, maxFollowedUser}) => {
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
                    <h3 className="font-xlarge">get verified</h3>
                    <p className="font-large">Subscribe to unlock more features</p>
                    <button>get verified</button>
                </div>
                <div className="right-nav-box hidden">
                    <h3 className="font-xlarge">who to follow</h3>
                    <br></br>
                     <div className="row-centered">
                          <img className="profile-pic" src={maxFollowedUser.photoUrl}  alt="user pic" />
                          <p>{maxFollowedUser.name}</p>
                     </div>
                </div>
           </div>)
           : <></>} 
        </div>
    );
}