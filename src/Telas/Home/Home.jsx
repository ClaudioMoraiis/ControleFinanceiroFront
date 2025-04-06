import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import DashBoard from '../Util/DashBoard';

export default function Home() {
    const [userName, setUserName] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const emailStorage = JSON.parse(localStorage.getItem('email'));
        if (!emailStorage) return;

        fetch(`http://192.168.18.22:8080/usuario/nome-por-email?email=${encodeURIComponent(emailStorage)}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.ok ? response.text() : 'Usuário')
            .then(data => setUserName(data))
            .catch(() => setUserName('Usuário'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('senha');
        localStorage.removeItem('idUsuario');
        navigate('/');
    };

    return (
        <div className="home-container">
            <div className="header">
                <div className="menu-container">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="menu-button">
                        ☰
                    </button>
                    
                    {menuOpen && (
                        <div className="menu-dropdown">
                            <ul className="menu-list">
                                <li onClick={() => navigate('/Contas')}>Contas</li>
                                <li onClick={handleLogout}>Sair</li>
                            </ul>
                        </div>
                    )}
                </div>
                
                <div className="welcome-text">
                    <h1>Que bom te ver de volta, {userName || 'Usuário'}</h1>
                    <p>Gerencie suas finanças com facilidade.</p>
                </div>
            </div>
            
            <div className="dashboard-container">
                <DashBoard />
            </div>
        </div>
    );
}
