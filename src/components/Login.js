import { auth, provider, db} from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

export const Login = ({ setIsAuth }) => {
    // const usersCollectionRef = collection (db, "users");
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
          setIsAuth(true);
          console.log(auth.currentUser.uid);
          //const userDoc = doc(db, "users", auth.currentUser.uid);
          /* if(!(doc(db, "users", auth.currentUser.uid))) {
            const createUser = async () => {
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    followedUsers: []
                });
            }
            createUser();
          } */
          
        });
    };

    return (
        <div className="section-container margin-top-200">
            <p>Sign in with google to continue:</p>
            <button onClick={signInWithGoogle} className='login-with-google-btn' >Sign In</button>
        </div>
    );
}