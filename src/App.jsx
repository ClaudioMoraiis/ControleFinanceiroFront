import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroUsuario from './Cadastros/CadastroUsuario'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/CadastroUsuario" element={<CadastroUsuario />} />
      </Routes>
    </Router>
  )
}

export default App
