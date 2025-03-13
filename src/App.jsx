import { useState } from 'react'
import './App.css'
import Login from './Telas/Login/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroUsuario from './Telas/Cadastros/CadastroUsuario'
import EsqueceuSenha from './Telas/EsqueceuSenha/EsqueceuSenha';
import RedefinirSenha from './Telas/RedefinirSenha/RedefinirSenha';
import Home from './Telas/Home/Home';
import Contas from './Telas/Contas/Contas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/CadastroUsuario" element={<CadastroUsuario />} />
        <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
        <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
        <Route path="/Home" element={<Home />} />
        <Route path = "/Contas" element={<Contas />}/>
      </Routes>
    </Router>
  )
}

export default App
