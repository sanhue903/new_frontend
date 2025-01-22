import lupa from '../../assets/images/lupa.png';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StudentsTable({ students }) {
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
        if (page*10 < totalStudents) {
            handlePage(page + 1);
        }
    };

    useEffect( () => {
            console.debug('students',students)
        if (students != null){
            handleTotalStudents(students.length);
            handleActualStudents(students.slice((page-1)*limit, page*limit));
        }
    }, [students , page]);


    return (
    <div>
        <div className="table">
        <table>
            <thead>
            <tr>
                <th>Numero</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Sesiones</th>
                <th>Informacion Detallada</th>
            </tr>
            </thead>
            <tbody>
            {actualStudents.map((student, index) => (
                <tr key={index} className={'table-row-' + (index % 2 == 0 ? 'even' : 'odd')}>
                    <td className='noText' style={{'width': '15%'}}>{student.id}</td>
                    <td className='text' style={{'width': '30%'}}>{student.name}</td>
                    <td className='noText' style={{'width': '15%'}}>{student.age}</td>
                    <td className='noText' style={{'width': '15%'}}>{student.session}</td>
                    <td className='noText' style={{'width': '25%'}}> 
                        <Link to={`/students/${student.id}/scores`}>
                            <img src={lupa} alt="Ver Scores" style={{ width: '30px', height: '30px' }} />
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        <div>
            <button onClick={previousPage} disabled={page == 1}>&lt;</button>
            <span style={{'white-space': 'pre'}}>  página {page}/{1 + Math.trunc(totalStudents/limit)}  </span>
            <button onClick={nextPage} disabled={page*limit > totalStudents}>&gt;</button>
        </div>
        </div>
    </div>
    );
}

export default StudentsTable;