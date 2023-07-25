/* 
export const Explore = ({currentPengs}) => {
    return currentPengs.map((currentPeng) => {
        return <p>{currentPeng.userName}</p>
    });
} */

import { Peng } from "./Peng";

export const Explore = ({pengs, userClickHandler, currentUserId, deleteHandler}) => {
    return pengs.map((peng) => {
        return <Peng key={peng.id} peng={peng} userClickHandler={userClickHandler} currentUserId={currentUserId} deleteHandler={deleteHandler} />
    });
}

/* export const Explore = () => {
    return <p>Explore View</p>
} */