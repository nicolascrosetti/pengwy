import { Peng } from "./Peng";

export const Home = ({pengs, userClickHandler}) => {
    return pengs.map((peng) => {
        return <Peng key={peng.id} peng={peng} userClickHandler={userClickHandler} />
    });
}