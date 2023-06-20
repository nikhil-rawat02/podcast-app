import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore/lite';

import { auth, db } from '../../firebase';
import { setUser } from '../../slices/userSlice';
import Header from '../../Components/Header/Header';
import Button from '../../Components/Button/Button';
import profileImage from '../../images/default-profile-picture.png';
import coverImage from '../../images/default-cover.png';
import addImage from '../../images/add-image.png';
import './Profile.css';
import ConfirmUpdate from '../../Components/ConfirmUpdate/ConfirmUpdate';
import UpdateUserImage from '../../Components/UpdateUserImage/UpdateUserImage';

function Profile() {

  const [userName, setUserName] = useState("");
  const [userBio, setUserBio] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [alternateMail, setAlternateMail] = useState("");
  const [isUpdateUserCoverImage, setIsUpdateUserCoverImage] = useState(false);
  const [isUpdateUserProfileImage, setIsUpdateUserProfileImage] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  // if user is present update users info state
  useEffect(() => {
    if (user) {
      setUserName(user.name ? user.name : "");
      setUserBio(user.bio ? user.bio : "");
      setDob(user.dob ? user.dob : dob ? dob : "");
      setGender(user.gender ? user.gender : "");
      setMobile(user.mobile ? user.mobile : "");
      setAlternateMail(user.alternateMail ? user.alternateMail : "");
    }
  }, [])

  // update user details when user has change inputs 
  const handleUpdateProfile = async () => {
    if (!userBio && !dob && !gender && !mobile && !alternateMail) {
      toast.error("Update atleast one details")
      return;
    }
    try {
      // save user's details in db
      await setDoc(doc(db, 'user', user.uid), {
        name: userName,
        email: user.email,
        coverImg: "",
        profileImg: "",
        bio: userBio,
        dob: dob,
        gender: gender,
        mobile: mobile,
        alternateMail: alternateMail,
        uid: user.uid
      });

      // save user data in redux store
      dispatch(setUser({
        name: userName,
        email: user.email,
        coverImg: "",
        profileImg: "",
        bio: userBio,
        dob: dob,
        gender: gender,
        mobile: mobile,
        alternateMail: alternateMail,
        uid: user.uid
      })
      );
    }
    catch (error) {
      if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters ")
      } else if (error.code === "auth/email-already-in-use") {
        alert("This mail ID already exist try loginIn");
      }
      console.log("error => ", error);
      console.log("message => ", error.message);
      console.log("error code => ", error.code);
    }
  }
  // handle logout functionality on click on logout button
  const handleLogout = () => {
    try {
      signOut(auth)
        .then(() => {
          toast.success("User Logged out")
        })
        .catch(error => {
          toast.success(error.code);
          console.log(error)
        })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Header />
      <div className="profile_container">
        <div className="cover_image">
          {/* get cover img link from firebase and add it here */}
          <img src={coverImage} alt="cover" />
          <div>
            <label htmlFor="change_cover">
              <img src={addImage} onClick={()=>{setIsUpdateUserCoverImage(prev => !prev)}} htmlFor="change_cover" alt="add_cover" />
            </label>
            {isUpdateUserCoverImage &&
              <UpdateUserImage action1="add_cover" />
            }
          </div>
        </div>
        <div className="profile_image">
          {/* get profile img link from firebase and add it here */}
          <img src={profileImage} alt="cover" />
          <div>
            <label htmlFor="change_cover">
              <img src={addImage} onClick={()=> setIsUpdateUserProfileImage(prev => !prev)} htmlFor="change_profile" alt="add_profile" />
            </label>
            {isUpdateUserProfileImage &&
              <UpdateUserImage action2="add_profile" />
            }
          </div>
        </div>
        <div className="userName_description">
          {/* get user display name and description from firebase and add it here */}
          <div>
            <span>{userName}</span>
            <Button buttonText="Logout" callback={handleLogout} className="btn_normal" />
          </div>
          <p>{userBio ? userBio : "Add a short bio..."}</p>
        </div>
        <div className="other_details">
          <h1 style={{ color: "white", marginBottom: "30px", textAlign: "center", width: "80vw" }}>Update you Profile Details </h1>
          <div className="user_details">
            <label htmlFor="userName">UserName</label>
            <input type="text" name="userName" placeholder="UserName" value={userName} onChange={e => setUserName(e.target.value)} />
          </div>
          <div className="user_details user_bio">
            <label htmlFor="userBio">Bio</label>
            <div>
              <textarea type="text" name="userBio" placeholder='Add a short Bio' maxLength={400} style={{width: "612px", height: "150px", borderRadius: "5px"}}
              onChange={e => setUserBio(e.target.value)} />
              <p>{400 - userBio.length} chacters left</p>
            </div>
          </div>
          <div className="user_details">
            <label htmlFor="userEmail">User email</label>
            <input type="email" name="userEmail" value={user.email} disabled />
          </div>
          <div className="user_details user_dob">
            <label htmlFor="userDOB">Date of birth</label>
            <input type="date" name="userDOB" value={user.dob ? user.dob : dob ? dob : ""} onChange={e => setDob(e.target.value)} />
          </div>
          <div className="user_details user_gender">
            <label htmlFor="userGender">Gender</label>
            <select name="userGender" onChange={e => setGender(e.target.value)}>
              <option value=""></option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div className="user_details mobile">
            <label htmlFor="userMobile">Mobile </label>
            <input type="text" name="userMobile" placeholder='mobile no.' value={mobile} onChange={e => setMobile(e.target.value)} />
          </div>
          <div className="user_details alternate_email">
            <label htmlFor="alternateEmail">Alternate Email</label>
            <input type="email" name="alternateEmail" placeholder='example@example.com' value={alternateMail} onChange={e => setAlternateMail(e.target.value)} />
          </div>
          <div className="user_podcast_albums">
            {/* add all the albums here and add onclick event */}

          </div>
          <div className="submit_button">
            <Button buttonText="Submit" type="submit" callback={handleUpdateProfile} className="btn_normal" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
