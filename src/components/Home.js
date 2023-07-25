import { Peng } from "./Peng";

export const Home = ({pengs, userClickHandler, currentUserId, deleteHandler}) => {
    return pengs.map((peng) => {
        return <Peng key={peng.id} peng={peng} userClickHandler={userClickHandler} currentUserId={currentUserId} deleteHandler={deleteHandler} />
    });
}