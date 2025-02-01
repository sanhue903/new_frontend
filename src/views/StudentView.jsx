import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import StudentScoreChartContainer from '../components/studentView/StudentScoreChartContainer'
import StudentInfoContainer from '../components/studentView/StudentInfoContainer'
import StudentScoresTable from '../components/studentView/StudentScoresTable'

import { fetchAppMobileData, fetchStudentSessionsData, fetchAllSessionsData, fetchStudentData } from '../services/apiServices';

const setData = async (fetchFunction, handleData, studentId) => {

    try {
        const response = await (studentId ? fetchFunction(studentId) : fetchFunction());

        if (response.status == 200){
            const data = await response.json();
            handleData(data);
        }
    } 
    catch (e) {
        console.error('error fetching data\n' + e);
    }
    
};


function StudentView() {
    const [mobileAppData, handleMobileAppData] = useState(null);
    const [allSessions, handleAllSessions] = useState(null);
    const [studentSessions, handleStudentSessions] = useState(null);

    const [student, handleStudent] = useState(null);

    const { studentId } = useParams();

    useEffect(() => {
        setData(fetchAppMobileData, handleMobileAppData);
    }, []);

    useEffect(() => {
        setData(fetchStudentData, handleStudent, studentId);
    }, []);

    useEffect(() => {
        setData(fetchAllSessionsData, handleAllSessions)
    }, []);

    useEffect(() => {
        setData(fetchStudentSessionsData, handleStudentSessions, studentId)
    }, []);

  return (
    <div>
      <NavBar />
      <StudentInfoContainer 
        student={student}
        sessions={studentSessions}
        mobileAppData={mobileAppData}
        />
      <StudentScoreChartContainer 
        mobileAppData = {mobileAppData} 
        allSessions = {allSessions} 
        studentSessions={studentSessions}
        />

    </div>
  )
}

export default StudentView;