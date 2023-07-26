import { useEffect, useState, useRef } from "react";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { LeftNav } from "./components/LeftNav";
import { RightNav } from "./components/RightNav";
import './style.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { getDocs, updateDoc, setDoc, arrayUnion, collection, doc, arrayRemove, deleteDoc } from "firebase/firestore";
import { Create } from "./components/Create";
import { Profile } from "./components/Profile";
import { Explore } from "./components/Explore";
import { useUpdateEffect } from "react-use";
import { BottomNav } from "./components/BottomNav";

const penguinIcon = require('./icons/penguin.png');

export const App = () => {
  //states
  const [isAuth, setIsAuth] = useState(false);
  const [pengs, setPengs] = useState([]);
  const [users, setUsers] = useState([]);
  const [pengsCreated, setPengsCreated] = useState(0);
  const [profileUser, setProfileUser] = useState({});
  const [profileUserPengs, setProfileUserPengs] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [currentUserFollowedPengs, setCurrentUserFollowedPengs] = useState([]);
  //views
  const [createViewOn, setCreateViewOn] = useState(false);
  const [profileViewOn, setProfileViewOn] = useState(false);
  const [exploreViewOn, setExploreViewOn] = useState(false);
  const [homeViewOn, setHomeViewOn] = useState(true);
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

  useEffect(() => {
    getCurrentUser();
  }, [users, pengs]);

  useEffect(() => {
    const tempPengs = [];

    if(currentUser.followedUsers){
        pengs.forEach((peng) => {
          (currentUser.followedUsers).forEach((followedUserId) => {
          if(peng.userId == followedUserId){
            tempPengs.push(peng);
          }
          });
        });
      setCurrentUserFollowedPengs(tempPengs);
    }
  }, [currentUser]);


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

  const getCurrentUser = () => {
    users.forEach((user) => {
      if(user.id == auth.currentUser.uid){
        const tempUser = {...user};
        setCurrentUser(tempUser);
      }
    });
  }

  //#region Following
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
    //Update users in db
    const updateUser = async (id, followedId) => {
      const userDoc = doc(db, "users", id);
      await setDoc(userDoc, {
        followedUsers: arrayUnion(followedId)
      }, {merge: true});
    };

    updateUser(currentUserId, userToFollowId);

    // Update users state locally
    const updatedUsersLocal = users.map((user) => {
      if (user.id === currentUserId) {
        return {
          ...user,
          followedUsers: [...user.followedUsers, userToFollowId],
        };
      }
      return user;
    });

    setUsers(updatedUsersLocal);
  }

  const unfollowUser = (currentUserId, userToFollowId) => {
    //Update users in db
    const updateUser = async (id, followedId) => {
      const userDoc = doc(db, "users", id);
      await setDoc(userDoc, {
        followedUsers: arrayRemove(followedId)
      }, {merge: true});
    }

    updateUser(currentUserId, userToFollowId);

    //Update users state locally
    const updatedUsersLocal = users.map((user) => {
      if (user.id === currentUserId) {
        // Filter followedUsers array to remove userToFollowId
        const updatedFollowedUsers = user.followedUsers.filter(
          (followedUserId) => followedUserId !== userToFollowId
        );
        // Create new user with updated followedUsers array
        return {
          ...user,
          followedUsers: updatedFollowedUsers,
        };
      }
      return user;
    });
    setUsers(updatedUsersLocal);
  }
  //#endregion

  const deleteHandler = (pengId) => {
    //Update pengs in db
    const deletePeng = async (pengId) => {
      const pengDoc = doc(db, "pengs", pengId);
      await deleteDoc(pengDoc);
    }

    deletePeng(pengId);

    //Update pengs state locally
    const updatedPengsLocal = pengs.filter(
      (peng) => peng.id !== pengId
    );
    
    setPengs(updatedPengsLocal);
  }

  return (
    <div className="container">
      {/* Mobile top nav */}
      <div id="top-nav" className="mobile-nav bottom-border">
        <img src={penguinIcon} className="logo-image" />
      </div>

      {/* Desktop Left Nav */}
      <LeftNav isAuth={isAuth} setCreateViewOn={setCreateViewOn} setProfileViewOn={setProfileViewOn} setExploreViewOn={setExploreViewOn} setHomeViewOn={setHomeViewOn} />
      
      {/* Main Section */}
      <div className="main-section">
        {/* If the user is authenticated show home section, else show login section */}
        { isAuth ? 
          (
            profileViewOn ? (<Profile checkIfFollowed={checkIfFollowed} user={profileUser} pengs={profileUserPengs} followUser={followUser} unfollowUser={unfollowUser} profileViewOn={profileViewOn} />) 
            : exploreViewOn ? (<Explore pengs={pengs} userClickHandler={userClickHandler} currentUserId={auth.currentUser.uid} deleteHandler={deleteHandler} />)
            : homeViewOn ? (<Home pengs={currentUserFollowedPengs} userClickHandler={userClickHandler} currentUserId={auth.currentUser.uid} deleteHandler={deleteHandler}  />) : null
          ) :
          (<Login setIsAuth={setIsAuth} />)
          }
      </div>
      
      {/* Desktop Right Nav */}
      <RightNav signUserOut={signUserOut} isAuth={isAuth} />

      {/* Create Peng Form */}
      { createViewOn ? <Create setCreateViewOn={setCreateViewOn} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} /> : <></> } 

      {/* Mobile Bottom Nav */}
      <BottomNav isAuth={isAuth} setProfileViewOn={setProfileViewOn} setExploreViewOn={setExploreViewOn} setHomeViewOn={setHomeViewOn} />
    </div>
  );
}

