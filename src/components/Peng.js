import { click } from "@testing-library/user-event/dist/click";
import Moment from "react-moment";

export const Peng = ({peng, userClickHandler}) => {
    const date = peng.date.toDate();
    const clickHandler = () => {
        if(userClickHandler){
            userClickHandler(peng.userName, peng.userId, peng.photoUrl);
        }
    }

    return (
        <div className="peng-box">
            <div className="peng-container">
                <div>
                    <img  className="profile-pic" src={peng.photoUrl} alt="profile pic" />
                </div>
                <div className="column">
                    <div className="row"> 
                        <p onClick={clickHandler} className="user-name"><strong>{peng.userName}</strong></p> 
                        <Moment className="date" date={date} fromNow ago />
                    </div>
                    <p>{peng.peng}</p>
                </div>
            </div>
        </div>
    );
}