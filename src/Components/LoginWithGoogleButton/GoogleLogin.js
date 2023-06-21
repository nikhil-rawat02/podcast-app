import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore/lite';
import { auth, db } from '../../firebase';
import { setUser } from '../../slices/userSlice';
import Google from '../Icon/google';
import profileImage from '../../images/default-profile-picture.png';
import coverImage from '../../images/default-cover.png';
import { toast } from 'react-toastify';

function GoogleLogin() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then(async (res) => {
                const user = res.user;
                // save user's details in db
                await setDoc(doc(db, 'user', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    coverImg: coverImage,
                    profileImg: profileImage,
                    bio: "Add you bio here",
                    dob: null,
                    gender: "",
                    mobile: NaN,
                    alternateMail: "",
                    uid: user.uid
                });

                // save user data in redux store
                dispatch(setUser({
                    name: user.displayName,
                    email: user.email,
                    coverImg: coverImage,
                    profileImg: profileImage,
                    bio: "Add you bio here",
                    dob: null,
                    gender: "",
                    mobile: NaN,
                    alternateMail: "",
                    uid: user.uid
                })
                );
                navigate("/profile");
                navigate("/profile")
            })
            .catch((error) => {
                if(error.code === "auth/unauthorized-domain"){
                    toast.error("unauthorized-domain! Try Signup")
                }
                console.log(`error Code =>  ${error.code}`);
                console.log(`error message =>  ${error.message}`);
                console.log(`Email error =>  ${error.customData.email}`);
                console.log(`Authentication error =>  ${GoogleAuthProvider.credentialFromError(error)}`);
            })
    }

    const buttonStyle = {
        height: "40px",
        width: "300px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        justifyContent: "center",
        color:"black",
    }

    return (
        <button
            onClick={handleLoginWithGoogle}
            style={buttonStyle}
        >
            {<Google />} Login with Google
        </button>
    )
}

export default GoogleLogin
