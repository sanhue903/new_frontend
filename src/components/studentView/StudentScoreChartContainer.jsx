import React, {useState} from "react";
import CorrectPercentajeChart from "../charts/CorrectPercentajeChart";
import MeanChart from "../charts/MeanChart";
import SessionChart from "../charts/SessionChart";
import StudentFilterContainer from "./StudentFilterContainer";
import StudentScoresTable from "./StudentScoresTable";



function StudentScoreChartContainer({ mobileAppData , allSessions , studentSessions }){
    const [studentInput, handleStudentInput] = useState(null);
    const [allInput, handleAllInput] = useState(null);
    const [domain, handleDomain] = useState(null);

    return (
        <div>
            <StudentFilterContainer
            mobileAppData={mobileAppData}
            allSessions={allSessions}
            studentSessions={studentSessions}
            handleStudentInput={handleStudentInput}
            handleAllInput={handleAllInput}
            handleDomain={handleDomain}
            />
            <div className="charts-container">
                <SessionChart sessions={studentInput}/>
                <CorrectPercentajeChart sessions={studentInput} domain={domain}/>
                <MeanChart lineSessions={allInput} barSessions={studentInput} domain={domain}/>
            </div>
            <StudentScoresTable
            mobileAppData={mobileAppData}
            sessions={studentInput}
            />
        </div>
    );
}

export default StudentScoreChartContainer;