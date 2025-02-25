import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './CadastroUsuario.css'


export default function CadastroUsuario() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [Email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const validateFields = () => {
        if (!usuario.trim() || !Email.trim() || !senha.trim()) {
            setError('Todos os campos são obrigatórios');
            return false;
        }
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        if (!validateFields()) {
            setLoading(false);
            return false;
        }

        console.log("Clicou no botão");

        fetch("http://192.168.18.22:8080/usuario/cadastrar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: usuario,
                email: Email,
                senha: senha
            })
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((errorMessage) => {
                        throw new Error(errorMessage);
                    });
                }
                // First check if there's actually JSON content
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                }
                // If not JSON, just return the text
                return response.text();
            })
            .then((data) => {
                console.log(data);
                setSuccess(true);
                setLoading(false);
                setUsuario('');
                setEmail('');
                setSenha('');
                return true;
            })
            .catch((error) => {
                console.error('Erro na requisição:', error);
                setError(error.message || 'Erro na requisição');
                setLoading(false);
                setSuccess(false);
                return false;
            });
        console.log(senha, usuario, Email);
    };

    useEffect(() => {
        const handleBackButton = () => {
            navigate("/");
        };

        window.onpopstate = handleBackButton;

        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);

        return (
            <div className="cadastro-usuario">
                <div className="cadastro-topo">
                    <h1 id="h1Cadastro">Cadastro</h1>
                </div>

                <div className="cadastro-corpo">
                    {error && <div className="error-message">{error}</div>}
                    <input
                        className="campo-cadastro"
                        type="text"
                        placeholder="Usuário"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <input
                        className="campo-cadastro"
                        type="text"
                        placeholder="Email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="campo-cadastro"
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <button
                        className="campo-cadastro"
                        id="btnCadastrar"
                        onClick={handleSubmit}
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
        )
    }