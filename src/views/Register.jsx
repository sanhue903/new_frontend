import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔹 Para redirigir después del registro exitoso
import validator from 'validator';
import { fetchRegister } from '../services/apiServices';

export default function Register() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [passError, setPassError] = useState('');
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // 🔹 Hook para la redirección

    useEffect(() => setServerError(''), [email, password1, password2]);

    // 🔹 Validación de Contraseñas
    const validatePasswords = (pass1, pass2) => {
        if (pass1 !== pass2) {
            setPassError('Las contraseñas no coinciden');
        } else if (pass1.length < 8) {
            setPassError('La contraseña debe tener al menos 8 caracteres');
        } else {
            setPassError('');
        }
    };

    // 🔹 Validación de Email
    const validateEmail = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setEmailError(validator.isEmail(emailValue) ? '' : 'Ingresa un Email válido');
    };

    // 🔹 Manejadores de Cambio de Contraseñas
    const handlePassword1Change = (e) => {
        const value = e.target.value;
        setPassword1(value);
        validatePasswords(value, password2);
    };

    const handlePassword2Change = (e) => {
        const value = e.target.value;
        setPassword2(value);
        validatePasswords(password1, value);
    };

    // 🔹 Manejo del Registro
    const handleRegister = async () => {
        setServerError(''); // 🔹 Limpia mensajes previos
        setSuccessMessage('');

        // 🔹 Validaciones previas antes de llamar a la API
        if (!email || emailError || passError) {
            setServerError('Por favor, corrige los errores antes de continuar.');
            return;
        }

        try {
            const response = await fetchRegister(email, password1, password2);

            if (response.status == 201) {
                setSuccessMessage('Registro exitoso. Redirigiendo al login...');
                setTimeout(() => navigate('/login'), 3000); // 🔹 Redirigir después de 3s
            } else {
                console.error(response)
                setServerError(response.message || 'Error en el registro.');
            }
        } catch (error) {
            console.error(error)
            setServerError(error.message || 'Error en el servidor.');
        }
    };

    return (
        <div>
            <h1 className="titulo"></h1>
            <div className="login-form">
                <h2>Registro</h2>
                <div className='inputs-container'>
                    <input type="email" value={email} onChange={validateEmail} placeholder="Correo" />
                    <input type="password" value={password1} onChange={handlePassword1Change} placeholder="Contraseña" />
                    <input type="password" value={password2} onChange={handlePassword2Change} placeholder="Confirmar Contraseña" />
                </div>

                <div className='messages-container'>
                    {<p className='error'>{emailError}</p>}
                    {<p className='error'>{passError}</p>}
                    {<p className='error'>{serverError}</p>}
                    {<p className='success'>{successMessage}</p>}
                <div className='buttons-container'>
                    <button 
                        onClick={handleRegister} 
                        disabled={emailError || passError || !email || !password1}>
                        Registrarse
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
}