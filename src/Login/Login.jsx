import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

export default function Login() {
    const navigate = useNavigate();
    const cadUsuario = () => {
        navigate("/CadastroUsuario");
    }

    return (
        <div className="login">
            <div className="login-topo">
                <h1 id="h1Login">Login</h1>
            </div>

            <div className="login-corpo">
                <div className="error-message"></div>
                <input
                    className="campo-login"
                    type="text"
                    placeholder="Email"
                />
                <input
                    className="campo-login"
                    type="password"
                    placeholder="Senha"
                />
                <button
                    id="btnEntrar"
                >
                    Entrar
                </button>
                <a
                    id="Entrar"
                    onClick={ cadUsuario }
                    href="#">Cadastrar
                </a>
            </div>
        </div>
    )
}