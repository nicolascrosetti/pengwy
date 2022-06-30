const penguinIcon = require('../icons/penguin.png');
const hashtagIcon = require('../icons/hashtag.png');
const homeIcon = require('../icons/home.png');

export const LeftNav = ({isAuth, setCreateViewOn}) => {
    const handlePengButton= () => {
        setCreateViewOn(true);
    }

    return ( 
        <ul className="nav gap-30 right-border">
            <li>
                <img className="logo-image" src={penguinIcon} alt="" />
            </li>
            { isAuth ? 
            (<>
            <li className='link'>
            <img className='icon' src={homeIcon} alt="" />
            <a>Home</a>
            </li>
            <li className='link'>
                <img className='icon' src={hashtagIcon} alt="" />
                <a>Explore</a>
            </li>
            <li>
                <button onClick={handlePengButton}>Peng</button>
            </li>
            </>) 
            : (<> <h2>Join Pengwy today.</h2> <p>Already have an account? Sign in.</p></>) 
            }
            
        </ul>
     );
}