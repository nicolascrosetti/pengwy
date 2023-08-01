import { auth } from "../firebase-config";

const penguinIcon = require('../icons/penguin.png');
const hashtagIcon = require('../icons/hashtag.png');
const homeIcon = require('../icons/home.png');
const userIcon = require('../icons/user.png');
const userBlackIcon = require('../icons/user-black.png');
const penguinOutlineImage = require('../img/penguin-outline.png');

export const LeftNav = ({isAuth, setCreateViewOn, setProfileViewOn, setExploreViewOn, setHomeViewOn, homeViewOn, exploreViewOn, profileViewOn, userClickHandler, currentUserProfileOn}) => {
    const handlePengButton= () => {
        setCreateViewOn(true);
    }
    const handleHomeButton = () => {
        setHomeViewOn(true);
        setProfileViewOn(false);
        setExploreViewOn(false);
    }
    const handleExploreButton = () => {
        setProfileViewOn(false);
        setHomeViewOn(false);
        setExploreViewOn(true);
    }
    const profileClickHandler = () =>{
        userClickHandler(auth.currentUser.displayName,auth.currentUser.uid,auth.currentUser.photoURL);
    }


    return ( 
        <ul id="left-nav" className="nav gap-30 right-border">
            <li>
                <img className="logo-image" src={penguinIcon} alt="" />
            </li>
            { isAuth ? 
            (<>
            <li className='link' onClick={handleHomeButton}>
                <img className='icon' src={homeIcon} alt="" />
                <a className={ homeViewOn && !profileViewOn ? 'bold' : '' }>Home</a>
            </li>
            <li className='link' onClick={handleExploreButton}>
                <img className='icon' src={hashtagIcon} alt="" />
                <a className={exploreViewOn && !profileViewOn ? 'bold' : ''}>Explore</a>
            </li>
            <li className='link' onClick={profileClickHandler}>
                <img className='icon' src={profileViewOn ? 
                                    currentUserProfileOn ? userBlackIcon : userIcon
                              : userIcon}
                alt="" />
                <a className={profileViewOn ? 
                                    currentUserProfileOn ? 'bold' : ''
                              : ''}
                >Profile</a>
            </li>
            <li>
                <button onClick={handlePengButton}>Peng</button>
            </li>
            <li className="penguin-outline-image">
                <img src={penguinOutlineImage} />
            </li>
            </>) 
            : (<> <h2>Join Pengwy today.</h2> <p>Already have an account? Sign in.</p></>) 
            }
            
        </ul>
     );
}