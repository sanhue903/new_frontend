import React, {useState , useEffect} from 'react';

function ChapterFilterSelect({ mobileAppData , handleChoice }) {
    const [value, handleValue] = useState('');
    const [options, handleOptions] = useState([]);

    useEffect(() => {
        if (mobileAppData != null){
            handleValue('todas');

            handleOptions(mobileAppData.chapters)
        }
    }, [mobileAppData]);

    useEffect(() => {
        if (mobileAppData != null) {
            console.log('Chapter filter: ' + value)
            handleChoice(value)
        }
    }, [value]);

    return (
        <div>
        <label htmlFor="chapter-select">Dimensión : </label>
        <select id="chapter-select" onChange={(e) => handleChoice(e.target.value)}>
            {/* Opción predeterminada */}
            <option value="todas">todas</option>
            {/* Renderizar opciones solo si chapters no es null/undefined */}
            {mobileAppData && options.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                    {chapter.name}
                </option>
            ))}
        </select>
    </div>
    );
}

export default ChapterFilterSelect;