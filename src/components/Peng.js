import Moment from "react-moment";

export const Peng = ({peng}) => {
    const date = peng.date.toDate();

    return (
        <div className="peng-box">
            <div className="peng-container">
                <div>
                    <img  className="profile-pic" src={peng.photoUrl} alt="profile pic" />
                </div>
                <div className="column">
                    <div className="row"> 
                        <p><strong>{peng.userName}</strong></p> 
                        <Moment className="date" date={date} fromNow ago />
                    </div>
                    <p>{peng.peng}</p>
                </div>
            </div>
        </div>
    );
}