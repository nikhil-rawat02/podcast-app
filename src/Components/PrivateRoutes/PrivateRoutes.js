import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import Loader from '../Loader/Loader';

function PrivateRoutes() {
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
        return < Loader />
    } else if (!user || error) {
        toast.warn("Login required!")
        return <Navigate to="/" replace />;
    } else {
        return <Outlet />
    }
};

export default PrivateRoutes
