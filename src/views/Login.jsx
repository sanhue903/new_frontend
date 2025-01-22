import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { fetchLogin } from '../services/apiServices';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetchLogin(email, password);
            if (response.status == 201) {
                navigate('/students');
            }
        }
        catch (e) {
            alert('Error al iniciar sesion', e)
        }

    
    }

    return (
    <div>
        <h1 className="titulo">Bienvenid@ al botiquín de las emociones</h1>
        <div className="login-form">
        <h2>Inicio de sesión</h2>
        <input type="text" placeholder="Email" value={ email } onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={ password } onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Ingresar</button>
        </div>
    </div>
    );
    }

export default Login;
