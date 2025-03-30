import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuSuspenso.css';

const MenuSuspenso = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('senha');
        localStorage.removeItem('idUsuario');
        navigate('/');
    };

    return (
        <div className="menu-suspenso">
            <ul>
                <li onClick={() => navigate('/Perfil')}>
                    <i className="fas fa-user"></i> Perfil
                </li>
                <li onClick={() => navigate('/Contas')}>
                    <i className="fas fa-file-invoice-dollar"></i> Contas
                </li>
                <li onClick={handleLogout} className="logout-item">
                    <i className="fas fa-sign-out-alt"></i> Sair
                </li>
            </ul>
        </div>
    );
};

export default MenuSuspenso;
