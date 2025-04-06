import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showSuccessPanel, setShowSuccessPanel] = useState(false);
    const [logou, setLogou] = useState(false);
    const [idUsuario, setIdUsuario] = useState('');
    const token = localStorage.getItem('token');

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

    const closePanel = () => {
        setShowSuccessPanel(false);
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
                setLoading(false);
            
                if (typeof data === 'string' && data.startsWith("Login realizado com sucesso")) {
                    setSuccess(true);
                    setError('');
                    setLogou(true);
                    
                    const token = data.replace("Login realizado com sucesso", "").trim();
                    localStorage.setItem("token", token);
                    localStorage.setItem("email", JSON.stringify(email));
 
                    fetch(`http://192.168.18.22:8080/usuario/id-por-email?email=${encodeURIComponent(email)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            "Authorization": `Bearer ${token}`
                        }
                    })
                        .then(response => response.text())
                        .then(userId => {
                            console.log("ID do usuário:", userId);
                            localStorage.setItem("idUsuario", userId);
                            setIdUsuario(userId);
                            
                            // Mostrar painel de sucesso e redirecionar
                            setShowSuccessPanel(true);
                            setTimeout(() => {
                                navigate("/Home");
                            }, 2000);
                        })
                        .catch(error => {
                            console.error("Erro ao buscar ID:", error);
                            navigate("/Home");
                        });
                } else {
                    setSuccess(false);
                    setError(data);
                    setLogou(false);
                    setShowSuccessPanel(true);
                }
            })            
            .catch((error) => {
                console.error('Erro na requisição:', error.message);
                setError(`${error.message}`);
                setLoading(false);
                setSuccess(false);
                setLogou(false);
                setShowSuccessPanel(true);
            });
    }

    return (
        <div className="login">
          <div className="login-topo">
            <h1 id="h1Login">Login</h1>
          </div>
    
          <div className="login-corpo">
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
              id="btnEntrar"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <a id="Entrar" onClick={cadUsuario} href="#">
              Cadastrar
            </a>
            <a href="#" onClick={esqueceuSenha}>
              Esqueceu sua senha?
            </a>
          </div>          
          {showSuccessPanel && (
            <div className="success-panel-overlay" onClick={closePanel}>
              <div className="success-panel">
                <div className="success-icon">
                  {logou ? "✓" : "✕"}
                </div>
                <h3>{logou ? "Login realizado com sucesso!" : "E-mail ou senha inválido"}</h3>
                <p>{logou ? "Redirecionando para a página inicial..." : "Clique em qualquer lugar para fechar"}</p>
                <button className="close-button" onClick={closePanel}>Fechar</button>
              </div>
            </div>
          )}         
        </div>
    );   
}
