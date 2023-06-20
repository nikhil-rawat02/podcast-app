import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../slices/userSlice';

function FaceBookLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleloginUsingFacebook = () => {
        const faceBookProvider = new FacebookAuthProvider();
        signInWithPopup(auth, faceBookProvider)
            .then((res) => {
                // call redux and set current logined user
                const user = res.user;
                const credential = FacebookAuthProvider.credentialFromResult(res);
                const accessToken = credential.accessToken;
                dispatch(setUser({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
                }))
                navigate("/profile")
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = FacebookAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            })
    }
    return (
        <button style={{color:"black"}} onClick={handleloginUsingFacebook}>Login with Facebook</button>
    )
}

export default FaceBookLogin
