import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";

export const Login = ({ setIsAuth }) => {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
          setIsAuth(true);
          console.log(auth.currentUser.photoURL);
        });
    };

    return (
        <div className="section-container margin-top-200">
            <p>Sign in with google to continue:</p>
            <button onClick={signInWithGoogle} className='login-with-google-btn' >Sign In</button>
        </div>
    );
}