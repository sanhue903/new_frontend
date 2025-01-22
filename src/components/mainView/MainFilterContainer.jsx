import { useEffect, useState } from "react";
import SessionFilterSelect from "../filters/SessionFilterSelect";
import ChapterFilterSelect from "../filters/ChapterFilterSelect";


const filterChapter = (sessions, choice) => {
    return sessions.filter(session => session.chapter_id === choice);
};

const filterSession = (sessions, choice) => {
    return sessions.filter(session => session.number == choice);
}

function MainFilterContainer({ mobileAppData , sessions , handleInput , handleDomain}){
    const [chapterChoice, handleChapterChoice] = useState(null);
    const [sessionChoice, handleSessionChoice] = useState(null);
    const [filteredSessions, handleFilteredSessions] = useState(null);

    useEffect(() => {
        if (sessions !== null && chapterChoice !== null) {
            if (chapterChoice === 'no') {
                handleFilteredSessions(sessions);
                handleDomain(mobileAppData);
                return;
            } 
            handleFilteredSessions(filterChapter(sessions, chapterChoice));
            handleDomain(mobileAppData.chapters.find(chapter => chapter.id === chapterChoice));
        }
    }, [sessions, chapterChoice]);

    useEffect(() => {
        if (filteredSessions !== null && sessionChoice !== null) {
            if (sessionChoice === 'no') {
                handleInput(filteredSessions);
                return;
            }
            handleInput(filterSession(filteredSessions, sessionChoice));
        }
    }, [filteredSessions, sessionChoice]);



    return (
        <div className="filter-container">
            <ChapterFilterSelect
                mobileAppData={mobileAppData} 
                handleDomain={handleDomain} 
                handleChoice={handleChapterChoice}/>
            <SessionFilterSelect
                sessions={filteredSessions} 
                handleChoice={handleSessionChoice}/>
        </div>
    );
}

export default MainFilterContainer;