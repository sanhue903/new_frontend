import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import lupa from '../../assets/images/lupa.png';
import { formatDate } from '../utils';

function StudentsTable({ students, sessions }) {
    const [page, handlePage] = useState(1);
    const [actualStudents, handleActualStudents] = useState([]);
    const [totalStudents, handleTotalStudents] = useState(0);
    const limit = 10;

    const previousPage = () => {
        if (page > 1) {
            handlePage(page - 1);
        }
    };

    const nextPage = () => {
        if (page * limit < totalStudents) {
            handlePage(page + 1);
        }
    };

    useEffect(() => {
        console.debug('students', students);
        if (students && students.length > 0) {
            handleTotalStudents(students.length);
            handleActualStudents(students.slice((page - 1) * limit, page * limit));
        }
    }, [students, page]);

    // 🔹 Función para obtener la fecha de la última sesión
    const getLastSessionDate = (studentId) => {
        if (!sessions || sessions.length === 0) return "No disponible";

        const studentSessions = sessions
            .filter(session => session.student_id === studentId)
            .map(session => new Date(session.date)) // Convertimos a formato Date para comparar
            .sort((a, b) => b - a); // Ordenamos de más reciente a más antigua

        return studentSessions.length > 0
            ? formatDate(studentSessions[0]) // 🔹 Retorna la fecha formateada
            : "No disponible";
    };

    return (
        <div>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Sesiones</th>
                            <th>Última Sesión jugada</th> {/* 🔹 Nueva columna */}
                            <th>Información Detallada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actualStudents.map((student, index) => (
                            <tr key={index} className={'table-row-' + (index % 2 === 0 ? 'even' : 'odd')}>
                                <td className='noText' style={{ width: '10%' }}>{student.id}</td>
                                <td className='text' style={{ width: '25%' }}>{student.name}</td>
                                <td className='noText' style={{ width: '10%' }}>{student.age}</td>
                                <td className='noText' style={{ width: '15%' }}>{student.session}</td>
                                <td className='noText' style={{ width: '15%' }}>{getLastSessionDate(student.id)}</td> {/* 🔹 Muestra la última sesión */}
                                <td className='noText' style={{ width: '25%' }}>
                                    <Link to={`/students/${student.id}/scores`}>
                                        <img src={lupa} alt="Ver Scores" style={{ width: '30px', height: '30px' }} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <button onClick={previousPage} disabled={page === 1}>&lt;</button>
                    <span style={{ whiteSpace: 'pre' }}>  página {page}/{Math.ceil(totalStudents / limit)}  </span>
                    <button onClick={nextPage} disabled={page * limit >= totalStudents}>&gt;</button>
                </div>
            </div>
        </div>
    );
}

export default StudentsTable;