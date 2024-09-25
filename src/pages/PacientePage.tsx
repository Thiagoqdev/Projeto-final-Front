import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Paciente {
  nome: string;
  telefone: string;
  dataDaConsulta: string;
  categoria?: string;
  valorDaSessao?: number;
  quantidadeDeSessao?: number;
  valorTotal?: number;
  desconto?: number;
  valorPago?: number;
  vencimento?: string;
  situacaoFinanceira?: string;
}

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PacientePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [novoPaciente, setNovoPaciente] = useState<Paciente>({
    nome: '',
    telefone: '',
    dataDaConsulta: '',
    categoria: 'Mensal',
    valorDaSessao: 0,
    quantidadeDeSessao: 0,
    valorTotal: 0,
    desconto: 0,
    valorPago: 0,
    vencimento: '',
    situacaoFinanceira: '',
  });
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [pacienteDetalhes, setPacienteDetalhes] = useState<Paciente | null>(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get<Paciente[]>('http://localhost:5228/Cliente/TabelaSimples');
        setPacientes(response.data);
      } catch (error: any) {
        console.error('Erro ao buscar pacientes:', error.message);
      }
    };
    fetchPacientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    if (pacienteEditando) {
      setPacienteEditando({ ...pacienteEditando, [name]: value });
    } else {
      setNovoPaciente({ ...novoPaciente, [name]: value });
    }
  };

  const handleAddPaciente = async () => {
    try {
      await axios.post('http://localhost:5228/Cliente/AdicionarCliente', novoPaciente);
      setPacientes([...pacientes, novoPaciente]);
      setNovoPaciente({
        nome: '',
        telefone: '',
        dataDaConsulta: '',
        categoria: 'Mensal',
        valorDaSessao: 0,
        quantidadeDeSessao: 0,
        valorTotal: 0,
        desconto: 0,
        valorPago: 0,
        vencimento: '',
        situacaoFinanceira: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao adicionar novo paciente:', error);
    }
  };

  const handleEditPaciente = (index: number) => {
    setEditIndex(index);
    setPacienteEditando(pacientes[index]);
    setShowEditModal(true);
  };

  const handleSaveEditPaciente = async () => {
    if (editIndex !== null && pacienteEditando) {
      try {
        await axios.put(`http://localhost:5228/Cliente/AtualizarCliente?id=${pacientes[editIndex].nome}`, pacienteEditando);
        const updatedPacientes = [...pacientes];
        updatedPacientes[editIndex] = pacienteEditando;
        setPacientes(updatedPacientes);
        setShowEditModal(false);
      } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
      }
    }
  };

  const handleDeletePaciente = async (nome: string) => {
    try {
      await axios.delete(`http://localhost:5228/Cliente/RemoverCliente?nome=${nome}`);
      const updatedPacientes = pacientes.filter((p) => p.nome !== nome);
      setPacientes(updatedPacientes);
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
    }
  };

  const handleViewDetalhes = async (id: number) => {
    try {
      const response = await axios.get<Paciente[]>(`http://localhost:5228/Cliente/${id}`);
      setPacienteDetalhes(response.data[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes do paciente:', error);
    }
  };

  return (
    <div>
      <h1>Pacientes</h1>
      <button onClick={() => setShowModal(true)}>Adicionar Paciente</button>
      {showModal && (
        <div>
          <h2>Novo Paciente</h2>
          <input
            type="text"
            name="nome"
            value={novoPaciente.nome}
            onChange={handleInputChange}
            placeholder="Nome"
          />
          <input
            type="text"
            name="telefone"
            value={novoPaciente.telefone}
            onChange={handleInputChange}
            placeholder="Telefone"
          />
          <input
            type="date"
            name="dataDaConsulta"
            value={novoPaciente.dataDaConsulta}
            onChange={handleInputChange}
            placeholder="Data da Consulta"
          />
          <button onClick={handleAddPaciente}>Salvar</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
      {showEditModal && pacienteEditando && (
        <div>
          <h2>Editar Paciente</h2>
          <input
            type="text"
            name="nome"
            value={pacienteEditando.nome}
            onChange={handleInputChange}
            placeholder="Nome"
          />
          <input
            type="text"
            name="telefone"
            value={pacienteEditando.telefone}
            onChange={handleInputChange}
            placeholder="Telefone"
          />
          <input
            type="date"
            name="dataDaConsulta"
            value={pacienteEditando.dataDaConsulta}
            onChange={handleInputChange}
            placeholder="Data da Consulta"
          />
          <button onClick={handleSaveEditPaciente}>Salvar</button>
          <button onClick={() => setShowEditModal(false)}>Cancelar</button>
        </div>
      )}
      <ul>
        {pacientes.map((paciente, index) => (
          <li key={index}>
            {paciente.nome} - {paciente.telefone}
            <button onClick={() => handleEditPaciente(index)}>Editar</button>
            <button onClick={() => handleDeletePaciente(paciente.nome)}>Excluir</button>
            <button onClick={() => handleViewDetalhes(index)}>Ver Detalhes</button>
          </li>
        ))}
      </ul>
      {pacienteDetalhes && (
        <div>
          <h2>Detalhes do Paciente</h2>
          <p>Nome: {pacienteDetalhes.nome}</p>
          <p>Telefone: {pacienteDetalhes.telefone}</p>
          <p>Data da Consulta: {pacienteDetalhes.dataDaConsulta}</p>
        </div>
      )}
    </div>
  );
};

export default PacientePage;