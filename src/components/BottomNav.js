const hashtagIcon = require('../icons/hashtag.png');
const homeIcon = require('../icons/home.png');

export const BottomNav = ({isAuth, setProfileViewOn, setExploreViewOn, setHomeViewOn}) => {
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

    return(
        <div id='bottom-nav' className='mobile-nav top-border'>
            { isAuth ? 
            (<>
                <img className='icon' src={homeIcon} alt="" onClick={handleHomeButton} />
                <img className='icon' src={hashtagIcon} alt=""  onClick={handleExploreButton} />
            </>) 
            : null 
            }
        </div>
    );
}