import React, {useEffect , useState} from 'react';
import x from '../../assets/images/x.png';
import tick from '../../assets/images/tick.png';
import { formatDate } from '../utils';

function StudentScoresTable({ mobileAppData , sessions }) {
    const [page, handlePage] = useState(1);
    const [actualScores, handleActualScores] = useState([]);
    const [totalScores, handleTotalScores] = useState(0);
    const limit = 10;
    

    const previousPage = () => {
        if (page > 1) {
            handlePage(page - 1);
        }
    };

    const nextPage = () => {
        if (page*10 < totalScores) {
            handlePage(page + 1);
        }
    };

   useEffect(() => {
        if (sessions != null){
            const total = sessions.reduce((p,c) => p + c.scores.length,0);

            handleTotalScores(total);
            handlePage(1);
        }
   }, [sessions]); 

    useEffect( () => {
        if (sessions != null) {
            console.debug(sessions)
            const inferiorLimit = (page-1)*limit;
            const superiorLimit = page*limit;

            let index = 0;

            const auxArr = [];

            for (var session of sessions) {
                if (index < inferiorLimit) {
                    index+=limit;
                    continue;
                }

                for (var score of session.scores) {
                    if (index >= superiorLimit) {
                        break;
                    }
                    auxArr.push(score);
                    index++;
                }
            }

            handleActualScores(auxArr);
        }
    }, [sessions, page]);


    return (
    <div>
        <div className="table">
        <table>
            <thead>
            <tr>
              <th>Capítulo</th>
              <th>Pregunta</th>
              <th>Respuesta</th>
              <th>Sesión</th>
              <th>Fecha</th>
              <th>Segundos</th>
              <th>N&deg; Intentos</th>
              <th>Correcto</th>
            </tr>
            </thead>
            <tbody>
    {actualScores.length > 0 ? (
        actualScores.map((score, index) => {
            const chapter = mobileAppData.chapters.find(ch => ch.questions.some(q => q.id === score.question_id));
            const question = chapter?.questions.find(q => q.id === score.question_id);
            const session = sessions.find(s => s.id === score.session_id);

            return (
                <tr key={index} className={'table-row-' + (index % 2 === 0 ? 'even' : 'odd')}>
                    <td className='text' style={{ width: '10%' }}>{chapter?.name || 'N/A'}</td>
                    <td className='text' style={{ width: '35%' }}>{question?.text || 'N/A'}</td>
                    <td className='text' style={{ width: '30%' }}>{score.answer}</td>
                    <td className='noText' style={{ width: '5%' }}>{session?.number || 'N/A'}</td>
                    <td className='text' style={{ width: '5%' }}>{formatDate(session?.date) || 'N/A'}</td>
                    <td className='noText' style={{ width: '5%' }}>{score.seconds.toFixed(2)}</td>
                    <td className='noText' style={{ width: '5%' }}>{score.attempt}</td>
                    <td className='noText' style={{ width: '5%' }}>
                        {score.is_correct ? (
                            <img src={tick} alt="Sí" style={{ width: '33px', height: '33px', paddingTop: '5px' }} />
                        ) : (
                            <img src={x} alt="No" style={{ width: '33px', height: '33px', paddingTop: '5px' }} />
                        )}
                    </td>
                </tr>
            );
        })
    ) : (
        <tr>
            {/* 🔹 Ajustamos el `colSpan` para que ocupe toda la fila */}
            <td colSpan="8" style={{ 
                textAlign: 'center', 
                padding: '15px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#666' 
            }}>
                No hay datos disponibles
            </td>
        </tr>
    )}
</tbody>
        </table>
        <div>
            <button onClick={previousPage} disabled={page == 1}>&lt;</button>
            <span style={{'whiteSpace': 'pre'}}>  página {page}/{Math.ceil(totalScores/limit)}  </span>
            <button onClick={nextPage} disabled={page*limit >= totalScores}>&gt;</button>
        </div>
        </div>
    </div>
    );
}

export default StudentScoresTable;