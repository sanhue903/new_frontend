import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import validator from 'validator'; // 🔹 Validación de email
import { fetchLogin } from '../services/apiServices';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // 🔹 Validar si el email es válido
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setEmailError(validator.isEmail(emailValue) ? '' : 'Ingresa un email válido');
    };

    // 🔹 Redirigir a la vista de registro
    const handleRegister = () => {
        navigate('/register');
    };

    // 🔹 Manejo del inicio de sesión
    const handleLogin = async () => {
        setErrorMessage('');

        try {
            const response = await fetchLogin(email, password);

            if (response.status === 201) {
                navigate('/students');
            } else {
                setErrorMessage('Email o contraseña incorrectos');
            }
        } catch (error) {
            setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <h1 className="titulo">Bienvenid@ al botiquín de las emociones</h1>
            <div className="login-form">
                <h2>Inicio de sesión</h2>

                {/* 🔹 Contenedor de Inputs */}
                <div className="inputs-container">
                    <input 
                        type="text" 
                        placeholder="Email" 
                        value={email} 
                        onChange={handleEmailChange} 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                {/* 🔹 Contenedor de Mensajes */}
                <div className="messages-container">
                    {emailError && <p className="error">{emailError}</p>}
                    {errorMessage && <p className="error">{errorMessage}</p>}
                </div>

                {/* 🔹 Contenedor de Botones (Centrados y alineados) */}
                <div className="buttons-container">
                    <button 
                        onClick={handleLogin} 
                        disabled={!email || !password || emailError}>
                        Ingresar
                    </button>
                    <button onClick={handleRegister} className="secondary-button">
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
