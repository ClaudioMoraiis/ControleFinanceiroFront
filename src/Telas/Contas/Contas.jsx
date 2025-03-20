import React, { useState } from 'react';
import './Contas.css';

const Contas = () => {
  const [contas, setContas] = useState([]);
  const [nomeConta, setNomeConta] = useState('');
  const [valorConta, setValorConta] = useState('');
  const [tipoConta, setTipoConta] = useState('Mensal');
  const [busca, setBusca] = useState('');
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [alterouConta, setAlterouConta] = useState(false);
  const [dataConta, setDataConta] = useState('');

  const handleNomeContaChange = (event) => setNomeConta(event.target.value);
  const handleValorContaChange = (event) => setValorConta(event.target.value);

  const handleTipoContaChange = (event) => {
    const novoTipo = event.target.value;
    setTipoConta(novoTipo);
    console.log(novoTipo);
  };

  const handleBuscaChange = (event) => setBusca(event.target.value);
  const handleDataContaChange = (event) => setDataConta(event.target.value);

  const formatarData = (data, formato) => {
    if (!data) return "";

    let partes;

    if (data.includes("-")) {
      partes = data.split("-");
      if (partes.length !== 3) return data;
      if (formato === "dd/MM/yyyy") {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    } else if (data.includes("/")) {
      partes = data.split("/");
      if (partes.length !== 3) return data;
      if (formato === "yyyy-MM-dd") {
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
      }
    }

    return data;
  };

  const handleAdicionarConta = () => {
    const dataFormatada = formatarData(dataConta, "yyyy-MM-dd");

    fetch("http://192.168.18.22:8080/contas/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuarioID: 1,
        nome: nomeConta,
        valor: parseFloat(valorConta),
        tipo: tipoConta,
        data: dataFormatada,
      }),
    })
      .then(async (response) => {
        const text = await response.text();

        const data = JSON.parse(text);
        console.log("Sucesso:", data);
        setContas([...contas, {
          nome: nomeConta,
          valor: parseFloat(valorConta),
          tipo: tipoConta,
          dataConta: dataFormatada          
        }]);
      })
      .catch((error) => {
        console.error("Erro ao cadastrar conta:", error);
      });

      window.location.reload();      

    setNomeConta("");
    setValorConta("");
    setTipoConta("Mensal");
    setDataConta("");
    setMostrarPainel(false);
  };

  const handleBuscarConta = () => {
    const idUsuario = JSON.parse(localStorage.getItem('idUsuario'));
    console.log("ID do usuário:", idUsuario);
    fetch(`http://192.168.18.22:8080/contas/listarContas?idUsuario=${encodeURIComponent(idUsuario)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Resposta da API:", data);
        setContas(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar contas:", error);
      });
  };

  window.addEventListener("load", function () {
    handleBuscarConta();
  });

  const handleLimparCampo = () => {
    setNomeConta('');
    setValorConta('');
    setTipoConta('Mensal');
    setDataConta('');
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
    setDataConta(contaSelecionada.dataConta);
    setMostrarPainel(true);
    setAlterouConta(index);
  };

  const contasFiltradas = contas.filter((conta) =>
    conta.nomeConta.toLowerCase().includes(busca.toLowerCase())
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
                <strong>{conta.nomeConta}</strong> - R$ {conta.valor.toFixed(2)}{' '}
                <em>({conta.tipo})</em>
                <br />
                <em>Data: {formatarData(conta.data, "dd/MM/yyyy")}</em>
                <br />
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

      {/* Botão para Adicionar Conta */}
      <div className="button-container">
        <button
          onClick={() => {
            setAlterouConta(false);
            setMostrarPainel(true);
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
              <option value="Mensal">Mensal</option>
              <option value="Extra">Extra</option>
            </select>
            <label>{tipoConta === "Mensal" ? "Data vencimento" : "Data pagamento"}</label>
            <input
              type="date"
              placeholder="Data de Vencimento"
              className="input"
              value={dataConta}
              onChange={handleDataContaChange}
            />
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
