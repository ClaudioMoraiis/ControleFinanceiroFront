import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import './RedefinirSenha.css';

export default function RedefinirSenha() {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Token inválido ou ausente!');
            setShowPanel(true);
        }
    }, [searchParams]);

    const closePanel = () => {
        setShowPanel(false);
    };

    const handleRedefinirSenha = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        if (!token) {
            setError('Token inválido ou ausente!');
            setLoading(false);
            setShowPanel(true);
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem!');
            setLoading(false);
            setShowPanel(true);
            return;
        }

        try {
            const response = await fetch(`https://controlefinanceiro-wandering-glitter-7368.fly.dev/usuario/redefinir-senha?senha=${encodeURIComponent(senha)}&confirmarSenha=${encodeURIComponent(confirmarSenha)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    senha: senha,
                    confirmarSenha: confirmarSenha
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Erro ao redefinir senha!');
            }

            setSuccess(true);
            setError('');
            setConfirmarSenha('');
            setSenha('');
            setToken('');
            setShowPanel(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Erro na requisição:', err.message);
            setError(err.message);
            setSuccess(false);
            setShowPanel(true);
        } finally {
            setLoading(false);
        }
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
                            {success ? "Senha redefinida com sucesso!" : "Erro ao redefinir senha"}
                        </h3>
                        <p>
                            {success ? "Você será redirecionado para o login em alguns segundos." : "Clique em qualquer lugar para fechar."}
                        </p>
                        <button className="close-button" onClick={closePanel}>Fechar</button>
                    </div>
                </div>
            )}

            <div className="recovery-box">
                <h1>Redefinição de Senha</h1>
                <form className="recovery-form" onSubmit={handleRedefinirSenha}>
                    <div className="input-group">
                        <input
                            className="recovery-input"
                            type="password"
                            placeholder="Nova Senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="recovery-input"
                            type="password"
                            placeholder="Confirmar Nova Senha"
                            required
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="recovery-button"
                        disabled={loading}>
                        {loading ? 'Processando...' : 'Redefinir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
