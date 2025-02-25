import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './RedefinirSenha.css';

export default function RedefinirSenha() {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');

    useEffect(() => {
        // Obtendo o token da URL
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Token inválido ou ausente!');
        }
    }, [searchParams]);

    const handleRedefinirSenha = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        if (!token) {
            setError('Token inválido ou ausente!');
            setLoading(false);
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem!');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://192.168.18.22:8080/usuario/redefinir-senha?senha=${encodeURIComponent(senha)}&confirmarSenha=${encodeURIComponent(confirmarSenha)}`, {
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

            const data = await response.text();
            setSuccess(true);
            setError(data);
            setConfirmarSenha('');
            setSenha('');
            setToken('');
        } catch (error) {
            console.error('Erro na requisição:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="recovery-box">
                <h1>Redefinição de Senha</h1>
                {success && <p style={{ color: 'green' }}>Senha redefinida com sucesso!</p>}
                <form className='recovery-form' onSubmit={handleRedefinirSenha}>
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
