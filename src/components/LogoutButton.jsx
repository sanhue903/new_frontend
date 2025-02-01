import logoutImage from '../assets/images/logout.png';
import { fetchLogout } from '../services/apiServices';

function LogoutButton() {

    const logout = async () => {
        await fetchLogout();
        window.location.href = '/login';
        
    };

    return (
        <div className='logout'>
            <img src={logoutImage} width={'30px'} height={'30px'} alt="Logout" onClick={logout} />
        </div>
    );
}

export default LogoutButton;
