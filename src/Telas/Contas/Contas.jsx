import React, { useState, useEffect } from 'react';
import './Contas.css';

const Contas = () => {
  const [contas, setContas] = useState([]);
  const [con_id, setConId] = useState('');
  const [nomeConta, setNomeConta] = useState('');
  const [valorConta, setValorConta] = useState('');
  const [tipoConta, setTipoConta] = useState('Mensal');
  const [busca, setBusca] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [alterouConta, setAlterouConta] = useState(false);
  const [dataConta, setDataConta] = useState('');
  const [alterando, setAlterando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [showSuccessPanel, setShowSuccessPanel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroValor, setErroValor] = useState('');
  const [erroData, setErroData] = useState('');  
  const token = localStorage.getItem('token');

  const handleNomeContaChange = (event) => {
    setNomeConta(event.target.value);
    setErroNome('');
  };

  const handleValorContaChange = (event) => {
    setValorConta(event.target.value);
    setErroValor('');
  };

  const handleTipoContaChange = (event) => {
    const novoTipo = event.target.value;
    setTipoConta(novoTipo);
  };

  const handleBuscaChange = (event) => setBusca(event.target.value);
  const handleDataContaChange = (event) => {
    setDataConta(event.target.value);
    setErroData('');
  };

  const handleDataInicialChange = (event) => setDataInicial(event.target.value);
  const handleDataFinalChange = (event) => setDataFinal(event.target.value);

  useEffect(() => {
    handleBuscarConta();
  }, []);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if ((mostrarPainel || showSuccessPanel) && !e.target.closest('.painel') && !e.target.closest('.success-panel')) {
        e.preventDefault();
      }
    };

    if (mostrarPainel || showSuccessPanel) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mostrarPainel, showSuccessPanel]);

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

  const validarCampos = () => {
    let valido = true;

    setErroNome('');
    setErroValor('');
    setErroData('');

    if (!nomeConta.trim()) {
      setErroNome('Por favor, preencha o nome da conta.');
      valido = false;
    }

    if (!valorConta.trim()) {
      setErroValor('Por favor, informe o valor da conta.');
      valido = false;
    }

    if (!dataConta.trim()) {
      setErroData('Por favor, selecione uma data.');
      valido = false;
    }

    return valido;
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessPanel(true);
    setTimeout(() => {
      setShowSuccessPanel(false);
    }, 3000);
  };

  const adicionarConta = () => {
    setCarregando(true);
    const dataFormatada = formatarData(dataConta, "yyyy-MM-dd");
    const idUsuario = JSON.parse(localStorage.getItem('idUsuario')) || 1;

    fetch("http://192.168.18.22:8080/contas/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",        
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        usuarioID: idUsuario,
        nomeConta: nomeConta,
        valor: parseFloat(valorConta),
        tipo: tipoConta,
        data: dataFormatada,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const text = await response.text();
        console.log("Sucesso:", text);

        handleBuscarConta();
        showSuccess("Conta inserida com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar conta:", error);
        alert("Erro ao cadastrar conta. Por favor, tente novamente.");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  const excluirConta = (con_id) => {
    if (!con_id) {
      console.error("ID da conta não fornecido para exclusão");
      return;
    }

    setCarregando(true);
    fetch(`http://192.168.18.22:8080/contas/deletar?id=${encodeURIComponent(con_id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const text = await response.text();
        console.log("Sucesso:", text);

        handleBuscarConta();
        showSuccess("Conta excluída com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao excluir conta:", error);
        alert("Erro ao excluir conta. Por favor, tente novamente.");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  const alterarConta = () => {
    if (!con_id) {
      console.error("ID da conta não fornecido para alteração");
      return;
    }

    setCarregando(true);
    const dataFormatada = formatarData(dataConta, "yyyy-MM-dd");
    const idUsuario = JSON.parse(localStorage.getItem('idUsuario')) || 1;

    fetch("http://192.168.18.22:8080/contas/alterar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        con_id: con_id,
        usuarioID: idUsuario,
        nomeConta: nomeConta,
        valor: parseFloat(valorConta),
        tipo: tipoConta,
        data: dataFormatada,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const text = await response.text();
        console.log("Sucesso:", text);

        handleBuscarConta();
        showSuccess("Conta alterada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao alterar conta:", error);
        alert("Erro ao alterar conta. Por favor, tente novamente.");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  const handleAdicionarConta = () => {
    if (!validarCampos()) {
      return;
    }

    if (alterando) {
      alterarConta();
      setAlterando(false);
    } else {
      adicionarConta();
    }

    setNomeConta("");
    setValorConta("");
    setTipoConta("Mensal");
    setDataConta("");
    setMostrarPainel(false);
  };
    const handleBuscarConta = () => {
      setCarregando(true);
      const idUsuario = JSON.parse(localStorage.getItem('idUsuario')) || 1;
      console.log("ID do usuário:", idUsuario);

      fetch(`http://192.168.18.22:8080/contas/listarContasPorUsuario?idUsuario=${encodeURIComponent(idUsuario)}&detalhado=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(async (response) => {
        if (!response.ok) {
          const erroTexto = await response.text();
          console.error("Erro na resposta da API:", erroTexto);
          throw new Error("Erro ao buscar contas");
        }
        return response.json(); // Aqui você espera um JSON real
      })      
      .then((data) => {
        console.log("Resposta da API:", data);
        if (Array.isArray(data)) {
          setContas(data);
        } else {
          console.error("Dados recebidos não são um array:", data);
          setContas([]);
        }
      })      
        .catch((error) => {
          console.error("Erro ao buscar contas:", error);
          alert("Erro ao buscar contas. Por favor, recarregue a página.");
          setContas([]);
        })
        .finally(() => {
          setCarregando(false);
        });
    };
  const handleLimparCampo = () => {
    setNomeConta('');
    setValorConta('');
    setTipoConta('Mensal');
    setDataConta('');
  };

  const handleExcluirConta = (index) => {
    if (index >= 0 && index < contas.length) {
      const conta = contas[index];
      if (conta && conta.con_id) {
        excluirConta(conta.con_id);
      } else {
        console.error("Conta não possui ID válido:", conta);
      }
    }
  };

  const handleAlterarConta = (index) => {
    if (index >= 0 && index < contas.length) {
      const contaSelecionada = contas[index];
      if (!contaSelecionada) {
        console.error("Conta selecionada é undefined");
        return;
      }

      setConId(contaSelecionada.con_id);
      setNomeConta(contaSelecionada.nomeConta || '');
      setValorConta(contaSelecionada.valor ? contaSelecionada.valor.toString() : '');
      setTipoConta(contaSelecionada.tipo || 'Mensal');

      if (contaSelecionada.data) {
        const dataFormatada = formatarData(contaSelecionada.data, "yyyy-MM-dd");
        setDataConta(dataFormatada);
      } else {
        setDataConta('');
      }

      setMostrarPainel(true);
      setAlterouConta(index);
      setAlterando(true);
    }
  };

  const contasFiltradas = contas.filter((conta) => {
    const matchesBusca = conta && conta.nomeConta
      ? conta.nomeConta.toLowerCase().includes(busca.toLowerCase())
      : false;

    let matchesData = true;
    if (dataInicial) {
      matchesData = matchesData && new Date(conta.data) >= new Date(dataInicial);
    }
    if (dataFinal) {
      matchesData = matchesData && new Date(conta.data) <= new Date(dataFinal);
    }
    return matchesBusca && matchesData;
  });

  return (
    <div className="contas-container">
      <h2>Gerenciar Contas</h2>
      <div className='div-datas'>
        <label>Data inicial</label>
        <input
          id='inptDataInicial'
          type='date'
          className='inptData'
          value={dataInicial}
          onChange={handleDataInicialChange}
        />
        <label>Data final</label>
        <input
          id='inptDataFinal'
          type='date'
          className='inptData'
          value={dataFinal}
          onChange={handleDataFinalChange}
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Buscar Conta"
          value={busca}
          onChange={handleBuscaChange}
          className="input"
        />
      </div>

      <div className="contas-list">
        {carregando ? (
          <p className="loading">Carregando...</p>
        ) : contasFiltradas.length === 0 ? (
          <p className="no-results">Nenhuma conta encontrada.</p>
        ) : (
          contasFiltradas.map((conta, index) => (
            <div className="conta-item" key={conta.con_id || index}>
              <div className="conta-info">
                <strong>{conta.nomeConta}</strong> - R$ {conta.valor ? conta.valor.toFixed(2) : '0.00'}{' '}
                <em>({conta.tipo || 'N/A'})</em>
                <br />
                <em>Data: {conta.data ? formatarData(conta.data, "dd/MM/yyyy") : 'N/A'}</em>
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

      <div className="button-container">
        <button
          onClick={() => {
            setAlterouConta(false);
            setAlterando(false);
            handleLimparCampo();
            setMostrarPainel(true);
          }}
          className="button"
          disabled={carregando}
        >
          Adicionar Conta
        </button>
      </div>

      {mostrarPainel && (
        <div className="painel-container">
          <div className="painel">
            <h3>{alterando ? "Alterar Conta" : "Adicionar Nova Conta"}</h3>
            <input
              type="text"
              placeholder="Nome da Conta"
              value={nomeConta}
              onChange={handleNomeContaChange}
              className={`input ${erroNome ? 'input-error' : ''}`}
            />
            {erroNome && <div className="error-message">{erroNome}</div>}
            <input
              type="number"
              placeholder="Valor da Conta"
              value={valorConta}
              onChange={handleValorContaChange}
              className={`input ${erroValor ? 'input-error' : ''}`}
            />
            {erroValor && <div className="error-message">{erroValor}</div>}
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
              className={`input ${erroData ? 'input-error' : ''}`}
              value={dataConta}
              onChange={handleDataContaChange}
              id='data'
            />
            {erroData && <div className="error-message">{erroData}</div>}
            <div className="painel-buttons">
              <button
                onClick={handleAdicionarConta}
                className="button"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => {
                  handleLimparCampo();
                  setMostrarPainel(false);
                  setAlterando(false);
                  setErroNome('');
                  setErroValor('');
                  setErroData('');
                }}
                className="button"
                disabled={carregando}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPanel && (
        <div className="success-panel-overlay">
          <div className="success-panel">
            <div className="success-icon">✓</div>
            <h3>{successMessage}</h3>
            <div className="success-animation"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contas;
