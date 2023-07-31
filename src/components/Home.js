import { CreateMain } from "./CreateMain";
import { Peng } from "./Peng";

export const Home = ({pengs, userClickHandler, currentUserId, deleteHandler, pengsCreated, setPengsCreated}) => {
    return(
        <div className="w-full">
            <div className="header">
            <h3>Home</h3>
            <div className="row-centered">
                <p className="header-subtext">Following</p>
            </div>
        </div>
        <CreateMain pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} />
        {pengs.map((peng) => {
            return <Peng key={peng.id} peng={peng} userClickHandler={userClickHandler} currentUserId={currentUserId} deleteHandler={deleteHandler} />
        })}
        </div>
    );
}