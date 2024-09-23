import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import PacientesTable from '../components/PacientesTable';
import PacienteModal from '../components/PacienteModal';
import { Button } from 'react-bootstrap';
import PacienteDetalhesModal from '../components/PacienteDetalhesModal';
import { Paciente } from '../types/types';

// Generalizando o tipo de evento para cobrir todos os tipos de elementos de formulário
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PacientePage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);
  const [pacienteDetalhes, setPacienteDetalhes] = useState<Paciente | null>(null);
  const [novoPaciente, setNovoPaciente] = useState<Paciente>({
    nome: '',
    dataConsulta: '',
    telefone: '',
    formaPagamento: 'mensal',
  });

  useEffect(() => {
    // Consumir API para listar pacientes
    axios.get('http://localhost:5228/Cliente/TabelaSimples')
      .then(response => setPacientes(response.data))
      .catch(error => console.error(error));
  }, []);

  // Generalizando o tipo de evento para cobrir todos os tipos de elementos de formulário
  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    if (pacienteEditando) {
      setPacienteEditando({ ...pacienteEditando, [name]: value });
    } else {
      setNovoPaciente({ ...novoPaciente, [name]: value });
    }
  };

  const handleAddPaciente = () => {
    // Lógica para adicionar paciente via API
    axios.post('http://localhost:5228/Cliente/AdicionarCliente', novoPaciente)
      .then(response => {
        setPacientes([...pacientes, response.data]);
        setShowModal(false);
      })
      .catch(error => console.error(error));
  };

  const handleEditPaciente = (index: number) => {
    setPacienteEditando(pacientes[index]);
    setShowEditModal(true);
  };

  const handleSaveEditPaciente = () => {
    if (pacienteEditando) {
      // Lógica para atualizar paciente via API
      axios.put(`http://localhost:5228/Cliente/AtualizarCliente?id=${pacienteEditando.clienteId}`, pacienteEditando)
        .then(() => {
          const updatedPacientes = pacientes.map(p => p.clienteId === pacienteEditando.clienteId ? pacienteEditando : p);
          setPacientes(updatedPacientes);
          setShowEditModal(false);
        })
        .catch(error => console.error(error));
    }
  };

  const handleDeletePaciente = (index: number) => {
    const paciente = pacientes[index];
    // Lógica para deletar paciente via API
    axios.delete(`http://localhost:5228/Cliente/RemoverCliente?nome=${paciente.nome}`)
      .then(() => {
        setPacientes(pacientes.filter((_, i) => i !== index));
      })
      .catch(error => console.error(error));
  };

  const handleViewDetalhes = (index: number) => {
    setPacienteDetalhes(pacientes[index]);
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h1 className="text-center flex-grow-1">Pacientes</h1>
          <Button variant="success" onClick={() => setShowModal(true)}>
            Adicionar Novo Paciente
          </Button>
        </div>

        <PacientesTable
          pacientes={pacientes}
          onViewDetalhes={handleViewDetalhes}
          onEditPaciente={handleEditPaciente}
          onDeletePaciente={handleDeletePaciente}
        />

        <PacienteModal
          show={showModal}
          onHide={() => setShowModal(false)}
          paciente={novoPaciente}
          onInputChange={handleInputChange}
          onSave={handleAddPaciente}
          isEditing={false}
        />

        <PacienteModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          paciente={pacienteEditando || novoPaciente}
          onInputChange={handleInputChange}
          onSave={handleSaveEditPaciente}
          isEditing={true}
        />

        <PacienteDetalhesModal
          show={!!pacienteDetalhes}
          onHide={() => setPacienteDetalhes(null)}
          paciente={pacienteDetalhes}
        />
      </div>
    </div>
  );
};

export default PacientePage;