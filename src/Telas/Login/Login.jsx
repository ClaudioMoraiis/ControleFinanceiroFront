import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successLoginn, setSuccessLogin] = useState(false);
    const [idUsuario, setIdUsuario] = useState('');

    const navigate = useNavigate();
    const cadUsuario = () => {
        navigate("/CadastroUsuario");
    }

    const esqueceuSenha = () => {
        navigate("/EsqueceuSenha");
    }

    const validateFields = () => {
        if (!email.trim() || !senha.trim()) {
            setError('E-mail ou senha não informado');
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
        fetch("http://192.168.18.22:8080/usuario/login", {
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
                        throw new Error(`${text}`);
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

                localStorage.setItem("email", JSON.stringify(email));
                localStorage.setItem("senha", JSON.stringify(senha));
                localStorage.setItem("idUsuario", JSON.stringify(senha));

                setEmail("");
                setSenha("");
                setIdUsuario("");

                setSuccessLogin(true);
                return true;
            })
            .catch((error) => {
                console.error('Erro na requisição:', error.message);
                setError(`${error.message}`);
                setLoading(false);
                setSuccess(false);
                return false;
            });
    }

    useEffect(() => {
        const emailStorage = JSON.parse(localStorage.getItem('email'));
        if (!emailStorage) return;

        fetch(`http://192.168.18.22:8080/usuario/idPorEmail?email=${encodeURIComponent(emailStorage)}`, {
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
                    setIdUsuario(data);
                    console.log("ID do usuário:", data);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar nome do usuário:', error);
                setIdUsuario('Id');
            });
    }, []);

    if (successLoginn) {
        navigate("/Home");
    }

    return (
        <div className="login">
            <div className="login-topo">
                <h1 id="h1Login">Login</h1>
            </div>

            <div className="login-corpo">
                {error && <div className="error-message">{error}</div>}
                <input
                    className="campo-login"
                    type="email"
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
                    className="campo-login"
                    id="btnEntrar"
                    onClick={handleLogin}>
                    Entrar
                </button>

                <a
                    id="Entrar"
                    onClick={cadUsuario}
                    href="#">Cadastrar
                </a>

                <a
                    href="#"
                    onClick={esqueceuSenha}>
                    Esqueceu sua senha?
                </a>
            </div>
        </div>
    )
}