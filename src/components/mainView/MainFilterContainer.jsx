import { useEffect, useState } from "react";
import SessionFilterSelect from "../filters/SessionFilterSelect";
import ChapterFilterSelect from "../filters/ChapterFilterSelect";
import AgeFilterSelect from "../filters/AgeFilterSelect";


const filterChapter = (sessions, choice) => {
    return sessions.filter(session => session.chapter_id === choice);
};

const filterSession = (sessions, choice) => {
    return sessions.filter(session => session.number == choice);
}

const filterAgeStudents = (students, choice) => {
    return students.filter(student => student.age == choice);
}

const filterAgeSessions = (sessions, students) => {
    return sessions.filter(session => students.some(student => student.id == session.student_id));
}

function MainFilterContainer({ mobileAppData , sessions , students , handleStudentsInput , handleInput , handleDomain }){
    const [chapterChoice, handleChapterChoice] = useState(null);
    const [sessionChoice, handleSessionChoice] = useState(null);
    const [ageChoice, handleAgeChoice] = useState(null);
    const [ageFilteredSessions, handleAgeFilteredSessions] = useState(null);
    const [chapterFilteredSessions, handleChapterFilteredSessions] = useState(null);
    
    useEffect(() => {
        if (students != null && ageChoice !== null && sessions != null) {
            if (ageChoice === 'todas') {
                handleStudentsInput(students);
                handleAgeFilteredSessions(sessions)
                return;
            }

            const auxStudents = filterAgeStudents(students, ageChoice);
            handleStudentsInput(auxStudents);
            handleAgeFilteredSessions(filterAgeSessions(sessions, auxStudents))

        }
    }, [sessions , students, ageChoice]);

    useEffect(() => {
        if (ageFilteredSessions != null && chapterChoice !== null) {
            if (chapterChoice === 'todas') {
                handleChapterFilteredSessions(ageFilteredSessions);
                handleDomain(mobileAppData);
                return;
            } 
            handleChapterFilteredSessions(filterChapter(ageFilteredSessions, chapterChoice));
            handleDomain(mobileAppData.chapters.find(chapter => chapter.id === chapterChoice));
        }
    }, [ageFilteredSessions, chapterChoice]);

    useEffect(() => {
        if (chapterFilteredSessions !== null && sessionChoice !== null) {
            if (sessionChoice === 'todas') {
                handleInput(chapterFilteredSessions);
                return;
            }
            handleInput(filterSession(chapterFilteredSessions, sessionChoice));
        }
    }, [chapterFilteredSessions, sessionChoice]);

    


    return (
        <div className="filters-container">
            <AgeFilterSelect
                students={students}
                handleChoice={handleAgeChoice}/>
            <ChapterFilterSelect
                mobileAppData={mobileAppData} 
                handleDomain={handleDomain} 
                handleChoice={handleChapterChoice}/>
            <SessionFilterSelect
                sessions={chapterFilteredSessions} 
                handleChoice={handleSessionChoice}/>
        </div>
    );
}

export default MainFilterContainer;