import { useEffect, useState } from "react";
import SessionFilterSelect from "../filters/SessionFilterSelect";
import ChapterFilterSelect from "../filters/ChapterFilterSelect";


const ManageFilter = (sessions, choice, filter) => {
    if (choice === 'todas') {
        return sessions;
    }
    return sessions.filter(session => session[filter] == choice);
}

function StudentFilterContainer({ mobileAppData , allSessions, studentSessions , handleStudentInput ,handleAllInput , handleDomain}){
    const [chapterChoice, handleChapterChoice] = useState(null);
    const [sessionChoice, handleSessionChoice] = useState(null);
    const [filteredAllSessions, handleFilteredAllSessions] = useState(null);
    const [filteredStudentSessions, handleFilteredStudentSessions] = useState(null);

    useEffect(() => {
        if (mobileAppData !== null) {
            if (chapterChoice === 'todas') {
                handleDomain(mobileAppData)
                return;
            }

            handleDomain(mobileAppData.chapters.find(chapter => chapter.id == chapterChoice))
    }
    }, [chapterChoice]);

    useEffect(() => {
        if (allSessions !== null && chapterChoice !== null) {
            handleFilteredAllSessions(ManageFilter(allSessions, chapterChoice, 'chapter_id'))
        }
    }, [allSessions, chapterChoice]);

    useEffect(() => {
        if (studentSessions !== null && chapterChoice !== null) {
            handleFilteredStudentSessions(ManageFilter(studentSessions, chapterChoice, 'chapter_id'))
        }
    }, [studentSessions, chapterChoice]);

    useEffect(() => {
        if (filteredAllSessions !== null && sessionChoice !== null) {
            handleAllInput(ManageFilter(filteredAllSessions, sessionChoice, 'number'));
        }

    }, [filteredAllSessions, sessionChoice]);

    useEffect(() => {
        if (filteredStudentSessions !== null && sessionChoice !== null) {
            handleStudentInput(ManageFilter(filteredStudentSessions, sessionChoice, 'number'));
        }
    }, [filteredStudentSessions, sessionChoice]);

    return (
        <div className="filters-container">
            <ChapterFilterSelect
                mobileAppData={mobileAppData} 
                handleDomain={handleDomain} 
                handleChoice={handleChapterChoice}/>
            <SessionFilterSelect
                sessions={filteredStudentSessions} 
                handleChoice={handleSessionChoice}/>
        </div>
    );
}

export default StudentFilterContainer;