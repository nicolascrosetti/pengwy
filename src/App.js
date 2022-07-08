import { useEffect, useState, useRef } from "react";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { LeftNav } from "./components/LeftNav";
import { RightNav } from "./components/RightNav";
import './style.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { getDocs, updateDoc, setDoc, arrayUnion, collection, doc, arrayRemove } from "firebase/firestore";
import { Create } from "./components/Create";
import { Profile } from "./components/Profile";
import { useUpdateEffect } from "react-use";

export const App = () => {
  //states
  const [isAuth, setIsAuth] = useState(false);
  const [pengs, setPengs] = useState([]);
  const [users, setUsers] = useState([]);
  const [pengsCreated, setPengsCreated] = useState(0);
  const [profileUser, setProfileUser] = useState({});
  const [profileUserPengs, setProfileUserPengs] = useState([]);
  //views
  const [createViewOn, setCreateViewOn] = useState(false);
  const [profileViewOn, setProfileViewOn] = useState(false);
  //refs
  const pengsCollectionRef = collection(db, "pengs");
  const usersCollectionRef = collection(db, "users");


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

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      const tempUsers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(tempUsers);
    }
    getUsers();
  }, []);


 /*  useEffect(() => {
    users.forEach((user) => {
      console.log(user.followedUsers);
    });
  }, [users]) */

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

  const checkIfFollowed = (setIsFollowed, id) => {
    users.forEach((user) => {
      if(user.id == auth.currentUser.uid){
        (user.followedUsers).forEach((followedUser) =>{
          if(followedUser == id){
            setIsFollowed(true);
          }
        });
      }
    });
  }

  const followUser = (currentUserId, userToFollowId) => {
    const updateUser = async (id, followedId) => {
      const userDoc = doc(db, "users", id);
      await setDoc(userDoc, {
        followedUsers: arrayUnion(followedId)
      }, {merge: true});
    };

    updateUser(currentUserId, userToFollowId);
  }

  const unfollowUser = (currentUserId, userToFollowId) => {
    const updateUser = async (id, followedId) => {
      const userDoc = doc(db, "users", id);
      await setDoc(userDoc, {
        followedUsers: arrayRemove(followedId)
      }, {merge: true});
    }

    updateUser(currentUserId, userToFollowId);
  }

  return (
    <div className="container">
      <LeftNav  isAuth={isAuth} setCreateViewOn={setCreateViewOn} setProfileViewOn={setProfileViewOn} />
      <div className="main-section">
        {/* If the user is authenticated show home section, else show login section */}
        { isAuth ? 
          (
            profileViewOn ? (<Profile checkIfFollowed={checkIfFollowed} user={profileUser} pengs={profileUserPengs} followUser={followUser} unfollowUser={unfollowUser} profileViewOn={profileViewOn} />) : (<Home pengs={pengs} userClickHandler={userClickHandler} />)
          ) :
          (<Login setIsAuth={setIsAuth} />)
          }
      </div>
      <RightNav signUserOut={signUserOut} isAuth={isAuth} />

      { createViewOn ? <Create setCreateViewOn={setCreateViewOn} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} /> : <></> } 
    </div>
  );
}

