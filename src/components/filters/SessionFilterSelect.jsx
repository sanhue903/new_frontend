import React, {useState , useEffect} from 'react';

const getOptions = (maxValue) => {
    const options = [];

    for (var i = 1; i <= maxValue;i++) {
        options.push(i);
    }

    return options;
};

const getMaxNumberSession = (sessions) => {
    let maxValue = sessions.reduce(
        (prev, current) => current.number > prev.number ? current : prev, 
        {number: 0}).number

    return maxValue;
}

function SessionFilterSelect({ sessions , handleChoice }) {
    const [options, handleOptions] = useState([]);
    const [value, handleValue] = useState('');

    useEffect(() => {
        if (sessions != null) {
            handleValue('todas');

            let maxValue = getMaxNumberSession(sessions);
            handleOptions(getOptions(maxValue));
        }
    }, [sessions]);

    useEffect(() => {
        if (sessions != null) {
            console.log('Session filter: ' + value)
            handleChoice(value);
        }
    }, [sessions, value]);

    return (
        <div>
        <label htmlFor="chapter-select">Sesión: </label>
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

export default SessionFilterSelect;