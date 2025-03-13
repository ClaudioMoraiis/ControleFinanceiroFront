import React from "react";
import "./MenuSuspenso.css";

export default function MenuSuspenso() {
    return (
        <div className="menu-suspenso">
            <ul>
                <li><a href="/Contas">Minhas contas</a></li>
                <li><a href="/config">Configurações</a></li>
                <li><a href="/">Sair</a></li>
            </ul>
        </div>
    );
}
