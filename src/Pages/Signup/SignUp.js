import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore/lite';
import { useDispatch } from 'react-redux';
import { auth, db } from '../../firebase';
import { setUser } from '../../slices/userSlice';
import FaceBookLogin from '../../Components/LoginWithFacebookButton/FaceBookLogin';
import GoogleLogin from '../../Components/LoginWithGoogleButton/GoogleLogin';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input';
import Header from '../../Components/Header/Header';
import './SignUp.css';
import { toast } from 'react-toastify';

function SignUp() {

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (fullname === "" || email === "" || password === "" || confirmPassword === "") {
      toast.error("All field are necessary!")
      return;
    } else if (!email.includes("@")) {
      toast.error("Enter a valid emai")
    }
    else if (password !== confirmPassword) {
      toast.error("password does not match!")
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // save user's details in db
        await setDoc(doc(db, 'user', user.uid), {
          name: fullname,
          email: user.email,
          coverImg: "",
          profileImg: "",
          bio: "",
          dob: "",
          gender: "",
          mobile: "",
          alternateMail: "",
          uid: user.uid
        });

        // save user data in redux store
        dispatch(setUser({
          name: fullname,
          email: user.email,
          coverImg: "",
          profileImg: "",
          bio: "",
          dob: "",
          gender: "",
          mobile: "",
          alternateMail: "",
          uid: user.uid
        })
        );
        navigate("/profile");
      }
      catch (error) {
        if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters!")
        } else if (error.code === "auth/email-already-in-use") {
          toast.error("This mail ID already exist try loginIn")
        }
        console.log("error => ", error);
        console.log("message => ", error.message);
        console.log("error code => ", error.code);
      }
    }
  }
  return (
    <div className="container">
      <Header />

      <div className="form_container">
        <h1>Sign up for free to start listening.</h1>
        {/* <FaceBookLogin /> */}
        <GoogleLogin />

        <div className='seprator'>
          <hr />
          <span>or</span>
          <hr />
        </div>

        <form
          onSubmit={handleFormSubmit}>
          < Input
            type="text"
            state={fullname}
            setState={setFullname}
            placeholder="Full Name"
            required={true}
          />

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

          < Input
            type="password"
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder="Confirm Password"
            required={true}
          />

          <Button
            buttonText="Sign in"
            callback={handleFormSubmit}
            className="btn_normal"
            type="submit"
          />

        </form>
        <div className='login_option'>
          <span>Have an account?</span>
          <Link to="/login"> Log in.</Link>
        </div>
      </div>

    </div>
  )
}

export default SignUp
