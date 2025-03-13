import React, { useState } from 'react';
import './Contas.css'; // Importando o CSS
  const Contas = () => {
    const [contas, setContas] = useState([]);
    const [nomeConta, setNomeConta] = useState('');
    const [valorConta, setValorConta] = useState('');
    const [tipoConta, setTipoConta] = useState('mensal');
    const [busca, setBusca] = useState('');
    const [mostrarPainel, setMostrarPainel] = useState(false);
    const [alterouConta, setAlterouConta] = useState(false);

    const handleNomeContaChange = (event) => {
      setNomeConta(event.target.value);
    };

    const handleValorContaChange = (event) => {
      setValorConta(event.target.value);
    };

    const handleTipoContaChange = (event) => {
      setTipoConta(event.target.value);
    };

    const handleBuscaChange = (event) => {
      setBusca(event.target.value);
    };

    const handleAdicionarConta = () => {
      if (nomeConta && valorConta) {
        const novaConta = { nome: nomeConta, valor: parseFloat(valorConta), tipo: tipoConta };
    
        if (alterouConta !== false) {
          const novasContas = [...contas];
          novasContas[alterouConta] = novaConta;
          setContas(novasContas);
          setAlterouConta(false);
        } else {
          setContas([...contas, novaConta]);
        }
    
        setNomeConta('');
        setValorConta('');
        setTipoConta('mensal');
        setMostrarPainel(false);
      }
    };    

    const handleLimparCampo = () => {
      setNomeConta('');
      setValorConta('');
      setTipoConta('mensal');
    };

    const handleExcluirConta = (index) => {
      const novasContas = contas.filter((_, i) => i !== index);
      setContas(novasContas);
    };

    const handleAlterarConta = (index) => {
      const contaSelecionada = contas[index];
      setNomeConta(contaSelecionada.nome);
      setValorConta(contaSelecionada.valor);
      setTipoConta(contaSelecionada.tipo);
      setMostrarPainel(true);
      
      setAlterouConta(index);
    };
    

    const contasFiltradas = contas.filter((conta) =>
      conta.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
      <div className="contas-container">
        <h2>Gerenciar Contas</h2>

        {/* Campo de Busca */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Buscar Conta"
            value={busca}
            onChange={handleBuscaChange}
            className="input"
          />
        </div>

        {/* Lista de Contas Filtradas */}
        <div className="contas-list">
          {contasFiltradas.length === 0 ? (
            <p className="no-results">Nenhuma conta encontrada.</p>
          ) : (
            contasFiltradas.map((conta, index) => (
              <div className="conta-item" key={index}>
                <div className="conta-info">
                  <strong>{conta.nome}</strong> - R$ {conta.valor.toFixed(2)}{' '}
                  <em>({conta.tipo === 'mensal' ? 'Mensal' : 'Extra'})</em>
                </div>
                <div className="conta-buttons">
                  <button 
                    onClick={() => handleAlterarConta(index)}
                    className="button edit-button"
                  >
                    Alterar
                  </button>
                  <button 
                    onClick={() => handleExcluirConta(index)}
                    className="button delete-button"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      <div className="button-container">
        {/* Botão para Adicionar Conta */}
        <button
          onClick={() => {
            setAlterouConta(false);
            setMostrarPainel(true)
          }}
          className="button"
        >
          Adicionar Conta
        </button>
      </div>

      {/* Painel de Adição de Conta */}
      {mostrarPainel && (
        <div className="painel-container">
          <div className="painel">
            <h3>Adicionar Nova Conta</h3>
            <input
              type="text"
              placeholder="Nome da Conta"
              value={nomeConta}
              onChange={handleNomeContaChange}
              className="input"
            />
            <input
              type="number"
              placeholder="Valor da Conta"
              value={valorConta}
              onChange={handleValorContaChange}
              className="input"
            />
            <select
              value={tipoConta}
              onChange={handleTipoContaChange}
              className="input"
            >
              <option value="mensal">Mensal</option>
              <option value="extra">Extra</option>
            </select>
            <div className="painel-buttons">
              <button onClick={handleAdicionarConta} className="button">
                Salvar
              </button>
              <button
                onClick={() => {
                  handleLimparCampo();
                  setMostrarPainel(false);
                }}                
                className="button"                
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contas;
