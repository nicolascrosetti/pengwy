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
import { Profile } from "./components/Profile";
import { useUpdateEffect } from "react-use";

export const App = () => {
  //states
  const [isAuth, setIsAuth] = useState(false);
  const [pengs, setPengs] = useState([]);
  const [pengsCreated, setPengsCreated] = useState(0);
  const [profileUser, setProfileUser] = useState({});
  const [profileUserPengs, setProfileUserPengs] = useState([]);
  //views
  const [createViewOn, setCreateViewOn] = useState(false);
  const [profileViewOn, setProfileViewOn] = useState(false);
  //refs
  const pengsCollectionRef = collection(db, "pengs");

  useEffect(() => {
    const getPengs = async () => {
      const data = await getDocs(pengsCollectionRef);
      //store and sort objects before updating pengs state
      const tempPengs = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const sortedPengs = tempPengs.sort((a,b) => {return b.date - a.date});
      setPengs(sortedPengs);
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

  const userClickHandler = (name,id,photoUrl) => {
    const userObj = (name,id,photoUrl) => {
      return {name,id,photoUrl}
    }
    const user = userObj(name,id,photoUrl);

    const userPengs = [];
    pengs.forEach((peng) => {
      if(peng.userId == id){
        userPengs.push(peng);
      }
    });

    setProfileUser(user);
    setProfileUserPengs(userPengs);
    setProfileViewOn(true);
  }

  return (
    <div className="container">
      <LeftNav  isAuth={isAuth} setCreateViewOn={setCreateViewOn} setProfileViewOn={setProfileViewOn} />
      <div className="main-section">
        {/* If the user is authenticated show home section, else show login section */}
        { isAuth ? 
          (
            profileViewOn ? (<Profile user={profileUser} pengs={profileUserPengs} />) : (<Home pengs={pengs} userClickHandler={userClickHandler} />)
          ) :
          (<Login setIsAuth={setIsAuth} />)
          }
      </div>
      <RightNav signUserOut={signUserOut} isAuth={isAuth} />

      { createViewOn ? <Create setCreateViewOn={setCreateViewOn} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} /> : <></> } 
    </div>
  );
}

