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
import { DrawerNav } from "./components/DrawerNav";

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
  const [maxFollowedUser, setMaxFollowedUser] = useState({});
  //views
  const [profileViewOn, setProfileViewOn] = useState(false);
  const [exploreViewOn, setExploreViewOn] = useState(false);
  const [homeViewOn, setHomeViewOn] = useState(true);
  //subviews
  const [createViewOn, setCreateViewOn] = useState(false);
  const [drawerNavViewOn, setDrawerNavViewOn] = useState(false);
  const [currentUserProfileOn, setCurrentUserProfileOn] = useState(false);
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

    getMaxFollowedUser();
  }, []);

  useEffect(() => {
    if(isAuth){
      getCurrentUser();
    }
  }, [users, pengs]);

  useEffect(() => {
    if(isAuth){
      getCurrentUser();
    }
  }, [isAuth]);

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
    //check if its the currents users profile
    if(id == auth.currentUser.uid){
      setCurrentUserProfileOn(true);
    }else{
      setCurrentUserProfileOn(false);
    }

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

  const getMaxFollowedUser = () => {
    let maxFollowedUserTemp = {
      id: '',
      name: '',
      photoUrl: ''
    }
    let maxFollowers = 0;
    users.forEach((user) => {
      if(user.followedUsers.length > maxFollowers){
        maxFollowers = user.followedUsers.length;
        maxFollowedUserTemp.id = user.id;
      }
    });
    pengs.forEach((peng) => {
      if(peng.userId = maxFollowedUser.id){
        maxFollowedUserTemp.name = peng.userName;
        maxFollowedUserTemp.photoUrl = peng.photoUrl;
      }
    });

    setMaxFollowedUser(maxFollowedUserTemp);
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

  const pengButtonMobileHandler = () => {
    setCreateViewOn(true);
  }

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

  const profileIconMobileHandler = () => {
    setDrawerNavViewOn(true);
  }

  return (
    <div className="container">
      {/* Mobile top nav */}
      <div id="top-nav" className="mobile-nav bottom-border relative">
      { isAuth ?  (<img className="profile-icon-mobile" src={auth.currentUser.photoURL}  alt="user pic" onClick={profileIconMobileHandler} />) : null }
        <img src={penguinIcon} className="logo-image" />
      </div>

      {/* Desktop Left Nav */}
      <LeftNav isAuth={isAuth} setCreateViewOn={setCreateViewOn} setProfileViewOn={setProfileViewOn} setExploreViewOn={setExploreViewOn} setHomeViewOn={setHomeViewOn} homeViewOn={homeViewOn} exploreViewOn={exploreViewOn} profileViewOn={profileViewOn} userClickHandler={userClickHandler} currentUserProfileOn={currentUserProfileOn} />
      
      {/* Main Section */}
      <div className="main-section">
        {/* If the user is authenticated show home section, else show login section */}
        { isAuth ? 
          (
            profileViewOn ? (<Profile checkIfFollowed={checkIfFollowed} user={profileUser} pengs={profileUserPengs} followUser={followUser} unfollowUser={unfollowUser} profileViewOn={profileViewOn} setProfileViewOn={setProfileViewOn} />) 
            : exploreViewOn ? (<Explore pengs={pengs} userClickHandler={userClickHandler} currentUserId={auth.currentUser.uid} deleteHandler={deleteHandler} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated}/>)
            : homeViewOn ? (<Home pengs={currentUserFollowedPengs} userClickHandler={userClickHandler} currentUserId={auth.currentUser.uid} deleteHandler={deleteHandler} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} />) : null
          ) :
          (<Login setIsAuth={setIsAuth} />)
          }
      </div>
      
      {/* Desktop Right Nav */}
      <RightNav signUserOut={signUserOut} isAuth={isAuth} maxFollowedUser={maxFollowedUser} />

      {/* Create Peng Form */}
      { createViewOn ? <Create setCreateViewOn={setCreateViewOn} pengsCreated={pengsCreated} setPengsCreated={setPengsCreated} /> : <></> } 

      {/* Peng Mobile Button */}    
      { isAuth ? 
        <div id="peng-button-mobile" onClick={pengButtonMobileHandler}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      : null }
      
      {/* Mobile Bottom Nav */}
      <BottomNav isAuth={isAuth} setProfileViewOn={setProfileViewOn} setExploreViewOn={setExploreViewOn} setHomeViewOn={setHomeViewOn} />

      {/* Mobile Drawer Nav */}
      { drawerNavViewOn ? (<DrawerNav setDrawerNavViewOn={setDrawerNavViewOn} signUserOut={signUserOut} isAuth={isAuth} />) : null }
    </div>
  );
}

