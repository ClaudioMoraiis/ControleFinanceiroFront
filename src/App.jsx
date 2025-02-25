import { useState } from 'react'
import './App.css'
import Login from './Telas/Login/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroUsuario from './Telas/Cadastros/CadastroUsuario'
import EsqueceuSenha from './Telas/EsqueceuSenha/EsqueceuSenha';
import RedefinirSenha from './Telas/RedefinirSenha/RedefinirSenha';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/CadastroUsuario" element={<CadastroUsuario />} />
        <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
        <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
      </Routes>
    </Router>
  )
}

export default App
