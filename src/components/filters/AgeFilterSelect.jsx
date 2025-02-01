import React, {useState , useEffect} from 'react';

const getOptions = (students) => {
    
    const options = [...new Set(students.map(item => item.age).sort())];

    return options;
};

function AgeFilterSelect({ students , handleChoice }) {
    const [options, handleOptions] = useState([]);
    const [value, handleValue] = useState('');

    useEffect(() => {
        if (students !== null) {
            handleValue('todas');

            handleOptions(getOptions(students));
        }
    }, [students]);

    useEffect(() => {
        if (students !== null) {
            console.log('Age filter: ' + value)
            handleChoice(value);
        }
    }, [students, value]);

    return (
        <div className='filter-container'>
        <label htmlFor="chapter-select">Edad: </label>
        <select id="chapter-select" value={value} onChange={(e) => handleValue(e.target.value)}>
            {/* Opción predeterminada */}
            <option value="todas">todas</option>
            {/* Renderizar opciones solo si chapters no es null/undefined */}
            {options.map((number) => (
                <option key={number} value={number}>
                    {number}
                </option>
            ))}
        </select>
    </div>
    );
}

export default AgeFilterSelect;