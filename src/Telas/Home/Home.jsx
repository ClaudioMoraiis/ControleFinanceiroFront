import React, { useState, useEffect } from 'react';
import './Home.css';
import MenuSuspenso from './MenuSuspenso';

export default function Home() {
    const [userName, setUserName] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const emailStorage = JSON.parse(localStorage.getItem('usuario'));
        if (!emailStorage) return;

        fetch(`http://192.168.18.22:8080/usuario/BuscarUsuarioPorEmail?email=${encodeURIComponent(emailStorage)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro na requisição');
            return response.text();
        })
        .then(data => setUserName(data))
        .catch(error => console.error('Erro na requisição:', error));
    }, []);

    return (
        <div className="home-container">
            <div className='header'>
                <div className="menu-container">
                    <button onClick={() => setIsActive(!isActive)} className="menu-button">
                        ☰
                    </button>
                    {isActive && <MenuSuspenso />}
                </div>

                <h1>Que bom te ver de volta, {userName}</h1>
                <p>Gerencie suas finanças com facilidade.</p>
            </div>
        </div>
    );
}
