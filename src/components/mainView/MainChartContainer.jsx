import React, {useEffect, useState} from "react";
import CorrectPercentajeChart from "../charts/CorrectPercentajeChart";
import MeanChart from "../charts/MeanChart";
import SessionChart from "../charts/SessionChart";
import MainFilterContainer from "./MainFilterContainer";
import StudentsTable from "./StudentsTable";



function MainChartContainer({ mobileAppData , students , sessions }){
    const [input, handleInput] = useState(null);
    const [domain, handleDomain] = useState(null);
    const [studentsInput, handleStudentsInput] = useState(null);

    return (
        <div>
            <MainFilterContainer 
            mobileAppData={mobileAppData} 
            sessions={sessions}
            students={students}
            handleStudentsInput={handleStudentsInput}
            handleInput={handleInput}
            handleDomain={handleDomain}
            /> 
            <div className="charts-container">
                <SessionChart sessions={input}/>
                <CorrectPercentajeChart sessions={input} domain={domain}/>
                <MeanChart barSessions={input} domain={domain}/>
            </div>
            <StudentsTable students = {studentsInput} sessions={sessions} />
        </div>
    );
}

export default MainChartContainer;