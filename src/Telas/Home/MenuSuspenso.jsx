import React from "react";
import "./MenuSuspenso.css";

export default function MenuSuspenso() {
    
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="menu-suspenso">
            <ul>
                <li><a href="/Contas">Minhas contas</a></li>
                <li><a href="/config">Configurações</a></li>
                <li>
                    <a
                    onClick={handleLogout}
                    href="/Login">Sair</a>
                </li>
            </ul>
        </div>
    );
}
