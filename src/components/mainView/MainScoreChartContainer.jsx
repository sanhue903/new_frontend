import React, {useState, useEffect} from "react";
import CorrectPercentajeChart from "../charts/CorrectPercentajeChart";
import MeanChart from "../charts/MeanChart";
import SessionChart from "../charts/SessionChart";
import MainFilterContainer from "./MainFilterContainer";



function MainScoreChartContainer({ mobileAppData , sessions }){
    const [input, handleInput] = useState(null);
    const [domain, handleDomain] = useState(null);

    return (
        <div>
            <MainFilterContainer 
            mobileAppData={mobileAppData} 
            sessions={sessions}
            handleInput={handleInput}
            handleDomain={handleDomain}
            /> 
            <div className="charts-container">
                <SessionChart sessions={input}/>
                <CorrectPercentajeChart sessions={input} domain={domain}/>
                <MeanChart barSessions={input} domain={domain}/>
            </div>
        </div>
    );
}

export default MainScoreChartContainer;