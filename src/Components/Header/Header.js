import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import companyLogo from '../../images/logo.png';
import './header.css'
import { useSelector } from 'react-redux';
function Header() {
  
  const [scrolled , setScrolled] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  
  const user = useSelector(state => state.user.user);
  
  useEffect(()=>{
    let action = setTimeout(() => {
      if(user == null){
        setUserLoggedIn(false);
      }else{
        setUserLoggedIn(true);
      }
    }, 500);

    return ()=> clearTimeout(action);
    
  },[userLoggedIn]);

  const changeNAvBarColor = () =>{
    if(window.scrollY > 40){
      setScrolled(true);
    }else{
      setScrolled(false);
    }
  }
  
  window.addEventListener("scroll", changeNAvBarColor);


  return (
    <div className={scrolled ? 'nav_bar scrolled nav_scrolled' : 'nav_bar'} >
      <Link to="/" className={scrolled ? 'left scrolled' : 'left'}>
          <h1 style={{textDecoration:"none"}}>Podcast</h1>
          <img src={companyLogo} alt="logo" />
      </Link>

      <div className={scrolled > 5  > 1 ? 'right scrolled' : 'right'}>
      {!userLoggedIn ? <Link to="/login" id='signup_login' className='active'>Signup / Login</Link>:""} 
        <Link to="/dashboard">DashBoard</Link>
        <Link to="/album">My Podcast</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </div>
  )
}

export default Header
