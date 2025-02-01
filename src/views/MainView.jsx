import '../css/Students.css'
import React, {useState, useEffect} from 'react'
import NavBar from '../components/NavBar'
import MainChartContainer from '../components/mainView/MainChartContainer'

import { fetchAppMobileData, fetchAllSessionsData, fetchAllStudentsData } from '../services/apiServices';

const setData = async (fetchFunction, handleData) => {

    try {
        const response = await fetchFunction();
        if (response.status === 200){
            const data = await response.json();

            handleData(data);
        }
    } 
    catch (e) {
        console.error('error fetching data\n' + e);
    }
    
};


function MainView() {
    const [mobileAppData, handleMobileAppData] = useState(null);
    const [sessions, handleSessions] = useState(null);
    const [students, handleStudents] = useState(null);

    useEffect(() => {
        setData(fetchAppMobileData, handleMobileAppData);
    }, []);

    useEffect(() => {
        setData(fetchAllStudentsData, handleStudents);
    }, []);

    useEffect(() => {
        setData(fetchAllSessionsData, handleSessions)
    }, []);

  return (
    <div>
      <NavBar />
        <h1>El Botiquín de las Emociones</h1>
      <MainChartContainer mobileAppData = {mobileAppData} students={students} sessions = {sessions}/>
    </div>
  )
}

export default MainView
