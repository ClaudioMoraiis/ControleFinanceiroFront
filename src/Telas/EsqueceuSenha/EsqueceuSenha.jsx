import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EsqueceuSenha.css';

export default function EsqueceuSenha() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`http://192.168.18.22:8080/usuario/recuperar-senha?email=${encodeURIComponent(email)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: new URLSearchParams({ email: email }),
        });

        alert("Se este e-mail estiver cadastrado, você receberá um e-mail com instruções para redefinir sua senha.");
        setEmail('');
    }
    
    return (
        <div className="container">
            <div className="recovery-box">
                <h1>Recuperação de Senha</h1>
                <p>Digite seu e-mail para receber as instruções de recuperação</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            className="recovery-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu e-mail"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="recovery-button">
                        Enviar
                    </button>
                    
                    <Link to="/Login" className="back-link">
                        Voltar para Login
                    </Link>
                </form>
            </div>
        </div>
    );
}