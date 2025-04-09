import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EsqueceuSenha.css';

export default function EsqueceuSenha() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPanel, setShowPanel] = useState(false);

    const closePanel = () => {
        setShowPanel(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const response = await fetch(`https://controlefinanceiro-wandering-glitter-7368.fly.dev/usuario/recuperar-senha?email=${encodeURIComponent(email)}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: new URLSearchParams({ email: email }),
            });

            if (response.ok) {
                setSuccess(true);
                setError('');
            } else {
                setSuccess(false);
                setError("Ocorreu um problema ao tentar redefinir a senha.");
            }
        } catch (err) {
            setSuccess(false);
            setError("Ocorreu um problema ao tentar redefinir a senha.");
        }
        setLoading(false);
        setShowPanel(true);
        setEmail('');
    };
    
    return (
        <div className="container">
            {showPanel && (
                <div className="success-panel-overlay" onClick={closePanel}>
                    <div className="success-panel">
                        <div className="success-icon">
                            {success ? "✓" : "✕"}
                        </div>
                        <h3>
                            {success ? "Instruções enviadas com sucesso!" : "Erro ao enviar instruções"}
                        </h3>
                        <p>
                            {success ? "Confira seu e-mail para mais informações." : "Clique em qualquer lugar para fechar."}
                        </p>
                        <button className="close-button" onClick={closePanel}>Fechar</button>
                    </div>
                </div>
            )}

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
                    
                    <button type="submit" className="recovery-button" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                    
                    <Link to="/Login" className="back-link">
                        Voltar para Login
                    </Link>
                </form>
            </div>
        </div>
    );
}