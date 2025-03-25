import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

const data = [
    { name: "Vendas", value: 400 },
    { name: "Marketing", value: 300 },
    { name: "TI", value: 200 },
    { name: "RH", value: 100 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
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
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${value}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="additional-content">
                <h3>Resumo Financeiro</h3>
                <p>Este gráfico mostra a distribuição dos seus gastos por categoria.</p>
                
                <h3>Detalhamento</h3>
                <ul>
                    <li><strong>Vendas:</strong> R$ 400,00</li>
                    <li><strong>Marketing:</strong> R$ 300,00</li>
                    <li><strong>TI:</strong> R$ 200,00</li>
                    <li><strong>RH:</strong> R$ 100,00</li>
                </ul>
                <h1></h1>
            </div>
        </div>
    );
};

export default Dashboard;
