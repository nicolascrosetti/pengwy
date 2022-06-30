
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db, auth } from "../firebase-config";

const closeIcon = require('../icons/close.png');

export const Create = ({setCreateViewOn, pengsCreated, setPengsCreated} ) => {
    //state
    const [peng, setPeng] = useState('');
    //refs
    const pengsCollectionRef = collection(db, "pengs");
    const today = new Date();

    const createPeng = async () => {
        setCreateViewOn(false);

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
    
    //Handlers
    const handleCloseClick = () => {
        setCreateViewOn(false);
    }

    const handleTextArea = (e) => {
        setPeng(e.target.value);
    }

    return(
        <div className="modal-background">
            <div className="modal-box column">
                <div>
                    <img src={closeIcon} alt="close" className='icon-small' id='close-icon' onClick={handleCloseClick} />
                </div>
                <div>
                    <img className="profile-pic" src={auth.currentUser.photoURL}  alt="user pic" />
                    <textarea onChange={(e) => handleTextArea(e)} placeholder="What's happening?" cols="40" rows="14">
                    </textarea>
                </div>
                <div>
                    <button onClick={createPeng} id='create-button'>Peng</button>
                </div>
            </div>
        </div>
    );
}