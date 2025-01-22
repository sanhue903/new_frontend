import React, {useEffect , useState} from 'react';
import x from '../../assets/images/x.png';
import tick from '../../assets/images/tick.png';

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
        if (sessions !== null) {
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
              <th>Segundos</th>
              <th>Intentos</th>
              <th>Correcto</th>
            </tr>
            </thead>
            <tbody>
            {actualScores.map((score, index) => {
                const chapter = mobileAppData.chapters.find(chapter => chapter.questions.some(q => q.id === score.question_id));
                const question = chapter.questions.find(question => question.id === score.question_id);
                const session = sessions.find(session => session.id === score.session_id)

                return (
                <tr key={index} className={'table-row-' + (index % 2 == 0 ? 'even' : 'odd')}>
                    <td className='text' style={{'width' : '10%'}}>{chapter.name}</td>
                    <td className='text' style={{'width' : '35%'}}>{question.text}</td>
                    <td className='text' style={{'width' : '35%'}}>{score.answer}</td>
                    <td className='noText' style={{'width' : '5%'}}>{session.number}</td>
                    <td className='noText' style={{'width' : '5%'}}>{score.seconds.toFixed(2)}</td>
                    <td className='noText' style={{'width' : '5%'}}>{score.attempt}</td>
                    <td className='noText' style={{'width' : '5%'}}>{score.is_correct ? (
                        <img src={tick} alt="Sí" style={{ width: '33px', height: '33px', paddingTop: '5px' }} />) : (
                        <img src={x} alt="No" style={{ width: '33px', height: '33px', paddingTop: '5px' }} />
                  )}
                  </td>
                </tr>
                )}
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