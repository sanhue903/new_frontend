import React, { useEffect, useState } from 'react'

function StudentInfoContainer({ student , sessions , mobileAppData }) {
    const [name, handleName] = useState('');
    const [age, handleAge] = useState('');
    const [lastChapter, handleLastChapter] = useState('');

    useEffect(() => {
        if (student != null) {
            console.debug(student[0])
            handleAge(student[0].age);
            handleName(student[0].name);
        }
    }, [student]);

    useEffect(() => {
        if (sessions != null && mobileAppData != null) {
            const id = sessions.at(-1).chapter_id;
            const chapter = mobileAppData.chapters.find(chapter => chapter.id === id);
            handleLastChapter(chapter.name)
        }
    }, [sessions, mobileAppData]);

    return (
    <div>
        <h3>Información del Estudiante</h3>
        <div style={{'white-space': 'pre'}} className='studentInfoContainer'>
            <div className='column'>
                <p><b>Nombre:</b> {name}</p>
            </div>
            <div className='column'>
                <p><b>Edad:</b> {age}</p>
            </div>
            <div className='column'>
                <p><b>Ultimo capitulo:</b> {lastChapter}</p>
            </div>
        </div>
    </div>
  )
}

export default StudentInfoContainer
