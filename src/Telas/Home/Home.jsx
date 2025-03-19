import React, { useState, useEffect } from 'react';
import './Home.css';
import MenuSuspenso from './MenuSuspenso';

export default function Home() {
    const [userName, setUserName] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const emailStorage = JSON.parse(localStorage.getItem('email'));
        if (!emailStorage) return;

        fetch(`http://192.168.18.22:8080/usuario/nome-por-email?email=${encodeURIComponent(emailStorage)}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

                return response.text();    
        })
        .then(data => {
            if (data) {
                setUserName(data);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar nome do usuário:', error);
            setUserName('Usuário');
        });
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

                <h1>Que bom te ver de volta, {userName || 'Usuário'}</h1>
                <p>Gerencie suas finanças com facilidade.</p>
            </div>
        </div>
    );
}
