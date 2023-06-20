import React, { useRef} from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './Pages/Signup/SignUp';
import Login from './Pages/Login/Index'
import Home from './Pages/Home'
import Profile from './Pages/Profile/Profile'
import PrivateRoutes from './Components/PrivateRoutes/PrivateRoutes';
import Dashboard from './Pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import Album from './Pages/Album/Album';
import MyPodcast from './Pages/MyPodcast/MyPodcast';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  const mainContainerRef = useRef(null);
  
  return (
    <div className='' ref={mainContainerRef}>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />

        <Route element={<PrivateRoutes />} >
          <Route path='/profile' element={<Profile />} />
          <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/album' element={<MyPodcast />}/>
          <Route path={'/album'} >
            <Route path={':id'} element={<Album />} />
          </ Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
