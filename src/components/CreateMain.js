
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db, auth } from "../firebase-config";

const closeIcon = require('../icons/close.png');

export const CreateMain = ({pengsCreated, setPengsCreated} ) => {
    //state
    const [peng, setPeng] = useState('');
    //refs
    const pengsCollectionRef = collection(db, "pengs");
    const today = new Date();

    const createPeng = async () => {
        //Change pengsCreated state to re-render pengs in Home component (to avoid infite loop)
        setPengsCreated(pengsCreated++);
        const newPengsCreated = pengsCreated + 1;
        setPengsCreated(newPengsCreated);

        //Add peng to database
        await addDoc(pengsCollectionRef, {
          peng,
          userName: auth.currentUser.displayName,
          userId: auth.currentUser.uid,
          photoUrl: auth.currentUser.photoURL,
          date: today
        });

        
      };

    const handleTextArea = (e) => {
        setPeng(e.target.value);
    }

    return(
        <div className="create-main">
                <div className="row-start">
                    <img className="profile-pic" src={auth.currentUser.photoURL}  alt="user pic" />
                </div>
                <div className="row-centered">
                    <textarea onChange={(e) => handleTextArea(e)} placeholder="What's happening!?" cols="50" rows="2"></textarea>
                </div>
                <div className="row-end">
                    <button onClick={createPeng} id='create-button'>peng</button>
                </div>
        </div>
    );
}