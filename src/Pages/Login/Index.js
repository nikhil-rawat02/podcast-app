import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore/lite';
import { toast } from 'react-toastify';
import { auth, db } from '../../firebase';
import { setUser } from '../../slices/userSlice';
import Header from '../../Components/Header/Header';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input';
import GoogleLogin from '../../Components/LoginWithGoogleButton/GoogleLogin';
import FacebookLogin from '../../Components/LoginWithFacebookButton/FaceBookLogin';
import profileImage from '../../images/default-profile-picture.png';
import coverImage from '../../images/default-cover.png';
import './index.css';

function Index() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // get data from the firebase db
            const userDoc = await getDoc(doc(db, "user", user.uid));
            const userData = userDoc.data();

            // set user to redux store
            dispatch(setUser({
                name: userData.name,
                email: user.email,
                coverImg: userData.coverImg ? userData.coverImg: coverImage,
                profileImg: userData.profileImg ? userData.profileImg: profileImage,
                bio: userData.bio ? userData.bio : "",
                dob: userData.dob ? userData.dob : "",
                gender : userData.gender ? userData.gender : "",
                mobile: userData.mobile ? userData.mobile : "",
                alternateMail: userData.alternateMail ? userData.alternateMail : "",
                uid: user.uid
              })
              );
            navigate("/dashboard");
        }
        catch(error){
            if(error.code === 'auth/wrong-password'){
                toast.error("wrong password");
            }else if(error.code === 'auth/user-not-found'){
                toast.error("Invalid Email")
            }
            console.log("error code ",error.code);
            console.log("error message", error.message);
        }  
    }
    return (
        <div className='container'>
            <Header/>
            <div className="login_container">
                <h1>Login to Podcast</h1>
                {/* <FacebookLogin /> */}
                <GoogleLogin />
                <div className='seprator'>
                    <hr />
                    <span>or</span>
                    <hr />
                </div>
                <form >
                    < Input
                        type="text"
                        state={email}
                        setState={setEmail}
                        placeholder="Email"
                        required={true}
                    />
                    < Input
                        type="password"
                        state={password}
                        setState={setPassword}
                        placeholder="Password"
                        required={true}
                    />
                    <Button buttonText="Login in" type="submit" callback={handleFormSubmit} className="btn_normal" />
                </form>
                <div className='login_option'>
                    <span>Don't have an account?</span>
                    <Link to="/signup"> Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Index
