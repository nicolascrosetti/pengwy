/* 
export const Explore = ({currentPengs}) => {
    return currentPengs.map((currentPeng) => {
        return <p>{currentPeng.userName}</p>
    });
} */
import { CreateMain } from "./CreateMain";
import { Peng } from "./Peng";

export const Explore = ({pengs, userClickHandler, currentUserId, deleteHandler, pengsCreated, setPengsCreated}) => {
    return(
        <div className="w-full">
            <div className="header">
            <h3>Explore</h3>
            <div className="row-centered">
                <p className="header-subtext">For you</p>
            </div>
        </div>
        <CreateMain pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} />
        {pengs.map((peng) => {
            return <Peng key={peng.id} peng={peng} userClickHandler={userClickHandler} currentUserId={currentUserId} deleteHandler={deleteHandler} />
        })}
        </div>
    );
}

/* export const Explore = () => {
    return <p>Explore View</p>
} */