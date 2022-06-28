import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { LeftNav } from "./components/LeftNav";
import { RightNav } from "./components/RightNav";
import './style.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { getDocs, collection, doc } from "firebase/firestore";

export const App = () => {
  //states
  const [isAuth, setIsAuth] = useState(false);
  const [pengs, setPengs] = useState([]);
  //refs
  const pengsCollectionRef = collection(db, "pengs");

  //get pengs
  useEffect(() => {
    const getPengs = async () => {
      const data = await getDocs(pengsCollectionRef);
      setPengs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getPengs();
  }, []);

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
      <LeftNav />
      <div className="main-section">
        {/* If the user is authenticated show home section, else show login section */}
        { isAuth ? 
        (<Home pengs={pengs} />) :
        (<Login setIsAuth={setIsAuth} />)
      }
      </div>
      
      <RightNav signUserOut={signUserOut} isAuth={isAuth} />
    </div>
  );
}

