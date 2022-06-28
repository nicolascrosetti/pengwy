import { Peng } from "./Peng";

export const Home = ({pengs}) => {
    return pengs.map((peng) => {
        return <Peng key={peng.id} peng={peng} />
    });
}