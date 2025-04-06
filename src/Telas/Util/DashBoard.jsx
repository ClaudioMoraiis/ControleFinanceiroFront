import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [detalhes, setDetalhes] = useState([]);

    const fetchData = () => {
        const idUsuario = localStorage.getItem("idUsuario");
        fetch(`http://192.168.18.22:8080/contas/listar-contas-por-usuario?idUsuario=${encodeURIComponent(idUsuario)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(responseData => {
                console.log("Resposta da API:", responseData);

                const contasIndividuais = [];
                let totaisObj = null;

                responseData.forEach(item => {
                    if (item.totais) {
                        totaisObj = item.totais;
                    } else if (item.con_id) {
                        contasIndividuais.push(item);
                    }
                });

                if (totaisObj) {
                    const chartData = Object.entries(totaisObj).map(([tipo, valor]) => ({
                        name: tipo,
                        value: valor
                    }));
                    console.log("Dados do gráfico:", chartData);
                    setData(chartData);
                }

                setDetalhes(contasIndividuais);
            })
            .catch(error => {
                console.error("Erro ao buscar contas:", error);
            });
    };

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    useEffect(() => {
        fetchData();
    }, []);

    const detalhesPorTipo = {};
    detalhes.forEach(conta => {
        if (!detalhesPorTipo[conta.tipo]) {
            detalhesPorTipo[conta.tipo] = [];
        }
        detalhesPorTipo[conta.tipo].push(conta);
    });

    return (
        <div className="dashboard">
            <h2 className="dashboard-title">Gráfico de contas</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="30%"
                            outerRadius="70%"
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={false}
                            onClick={null}
                            activeShape={null}
                            activeIndex={null}
                            style={{ outline: 'none' }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="additional-content">
                <button id="btnAtualizar" onClick={fetchData}>Atualizar</button>
                <h3>Resumo Financeiro</h3>
                <p>Este gráfico mostra a distribuição dos seus gastos por categoria.</p>

                <h3>Detalhamento</h3>
                <ul>
                    {data.length > 0 ? (
                        data.map((total, index) => {
                            const contas = detalhesPorTipo[total.name] || [];
                            const contasFiltradas = contas.filter(conta => {
                                if (conta.data) {
                                    const dataItem = new Date(conta.data);
                                    return dataItem >= firstDay && dataItem <= lastDay;
                                }
                                return true;
                            });
                            
                            return (
                                <li key={index}>
                                    <strong>{total.name}:</strong> R$ {total.value.toFixed(2)}
                                    {contasFiltradas.length > 0 && (
                                        <ul>
                                            {contasFiltradas.map((conta, idx) => (
                                                <li key={`${index}-${idx}`}>
                                                    {conta.nomeConta}: R$ {conta.valor.toFixed(2)}
                                                    {conta.data && ` (${conta.tipo === "MENSAL" ? "Vencimento" : "Pagamento"}: ${new Date(conta.data).toLocaleDateString()})`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li>Nenhum dado disponível</li>
                    )}
                </ul>
            </div>
            <div style={{ height: "100px" }}></div>
        </div>
    );
};

export default Dashboard;
