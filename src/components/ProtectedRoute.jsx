import React, { useState, useEffect } from 'react';
import { Navigate , useLocation } from 'react-router-dom';
import { fetchProfile } from '../services/apiServices';

const isLogged = async () => {
    try {
        const response = await fetchProfile();

        if (response.status == 200) {
            return true
        }
    }
    catch (e) {
        console.error(e)
    }

    return false;
}

const ProtectedRoute = ({ children }) => {
    const [logged, handleLogged] = useState(null);
    const [page, handlePage] = useState(<p>Cargando... </p>);
    const location = useLocation();

    useEffect(() => {
            handleLogged(isLogged());
    }, [location.pathname]);

    useEffect(() => {
        if (logged !== null) {
            console.debug('is logged: ', logged);
            handlePage(logged ? children : <Navigate to='/login'/>); 
        }
    }, [logged]);

    return page;

};

export default ProtectedRoute; 