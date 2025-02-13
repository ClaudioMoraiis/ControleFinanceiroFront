import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    
    const navigate = useNavigate();
    const cadUsuario = () => {
        navigate("/CadastroUsuario");
    }

    const validateFields = () => {
        if (!email.trim() || !senha.trim()) {
            setError('Todos os campos são obrigatórios');
            return false;
        }
        return true;
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);
    
        if (!validateFields()) {
            setLoading(false);
            return false;
        }
        console.log("Clicou no botão");
    
        setLoading(true);
        fetch("http://localhost:8080/usuario/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        })
            .then((response) => {
                console.log("Status da resposta:", response.status);
                console.log("Resposta completa:", response);
    
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Erro na requisição: ${response.status} - ${text}`);
                    });
                }
    
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then((data) => {
                console.log("Dados recebidos:", data);
                setError(data);
                setSuccess(true);
                setLoading(false);
                return true;
            })
            .catch((error) => {
                console.error('Erro na requisição:', error.message);
                setError(`Erro na requisição: ${error.message}`);
                setLoading(false);
                setSuccess(false);
                return false;
            });
    }
    

    console.log(senha, email);

    return (
        <div className="login">
            <div className="login-topo">
                <h1 id="h1Login">Login</h1>
            </div>

            <div className="login-corpo">
                {error && <div className="error-message">{error}</div>}
                <input
                    className="campo-login"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="campo-login"
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button
                    id="btnEntrar"
                    onClick={handleLogin}
                >
                    Entrar
                </button>
                <a
                    id="Entrar"
                    onClick={cadUsuario}
                    href="#">Cadastrar
                </a>
            </div>
        </div>
    )
}