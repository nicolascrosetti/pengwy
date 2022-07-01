import { useEffect, useState, useRef } from "react";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { LeftNav } from "./components/LeftNav";
import { RightNav } from "./components/RightNav";
import './style.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { getDocs, collection, doc } from "firebase/firestore";
import { Create } from "./components/Create";
import { useUpdateEffect } from "react-use";

export const App = () => {
  //states
  const [isAuth, setIsAuth] = useState(false);
  const [createViewOn, setCreateViewOn] = useState(false);
  const [pengs, setPengs] = useState([]);
  const [pengsCreated, setPengsCreated] = useState(0);
  //refs
  const pengsCollectionRef = collection(db, "pengs");

  useEffect(() => {
    const getPengs = async () => {
      const data = await getDocs(pengsCollectionRef);
      setPengs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getPengs();
  }, [pengsCreated]);

  //when pengs update
  /* useEffect(() => {
    console.log(pengs);
  }, [pengs]) */

  //sign out function
  const signUserOut = () => {
    signOut(auth).then(() => {
      setIsAuth(false);
    });
  };

  return (
    <div className="container">
      <LeftNav  isAuth={isAuth} setCreateViewOn={setCreateViewOn} />
      <div className="main-section">
        {/* If the user is authenticated show home section, else show login section */}
        { isAuth ? 
        (<Home pengs={pengs} />) :
        (<Login setIsAuth={setIsAuth} />)
      }
      </div>
      <RightNav signUserOut={signUserOut} isAuth={isAuth} />

      { createViewOn ? <Create setCreateViewOn={setCreateViewOn} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} /> : <></> } 
    </div>
  );
}

