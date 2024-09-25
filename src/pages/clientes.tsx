import { useEffect, useState } from 'react';
import axios from 'axios';

interface Cliente {
  nome: string;
  telefone: string;
  dataDaConsulta: string;
  categoria: string;
  valorDaSessao: number;
  quantidadeDeSessao: number;
  valorTotal: number;
  desconto: number;
  valorPago: number;
  vencimento: string;
  situacaoFinanceira: string;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get<Cliente[]>('http://localhost:5228/Cliente/TabelaDetalhada');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div>
      <h1>Lista de Clientes</h1>
      <ul>
        {clientes.map((cliente, index) => (
          <li key={index}>
            <p>Nome: {cliente.nome}</p>
            <p>Telefone: {cliente.telefone}</p>
            <p>Data da Consulta: {new Date(cliente.dataDaConsulta).toLocaleString()}</p>
            <p>Categoria: {cliente.categoria}</p>
            <p>Valor da Sessão: {cliente.valorDaSessao}</p>
            <p>Quantidade de Sessões: {cliente.quantidadeDeSessao}</p>
            <p>Valor Total: {cliente.valorTotal}</p>
            <p>Desconto: {cliente.desconto * 100}%</p>
            <p>Valor Pago: {cliente.valorPago}</p>
            <p>Vencimento: {cliente.vencimento}</p>
            <p>Situação Financeira: {cliente.situacaoFinanceira}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;