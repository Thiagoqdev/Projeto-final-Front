import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Paciente {
  nome: string;
  dataConsulta: string;
  telefone: string;
  formaPagamento: string;
}

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PacientePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [novoPaciente, setNovoPaciente] = useState<Paciente>({
    nome: '',
    dataConsulta: '',
    telefone: '',
    formaPagamento: 'mensal',
  });

  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setNovoPaciente({ ...novoPaciente, [name]: value });
  };

  const handleAddPaciente = () => {
    setPacientes([...pacientes, novoPaciente]);
    setNovoPaciente({ nome: '', dataConsulta: '', telefone: '', formaPagamento: 'mensal' });
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Pacientes</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Adicionar Novo Paciente
      </Button>

      <ul className="list-group mt-4">
        {pacientes.map((paciente, index) => (
          <li key={index} className="list-group-item">
            {paciente.nome} - {paciente.dataConsulta} - {paciente.telefone} - {paciente.formaPagamento}
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Paciente</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={novoPaciente.nome}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data da Consulta</Form.Label>
              <Form.Control
                type="date"
                name="dataConsulta"
                value={novoPaciente.dataConsulta}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone para Contato</Form.Label>
              <Form.Control
                type="tel"
                name="telefone"
                value={novoPaciente.telefone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Forma de Pagamento</Form.Label>
              <Form.Select
                name="formaPagamento"
                value={novoPaciente.formaPagamento}
                onChange={handleInputChange}
              >
                <option value="mensal">Mensal</option>
                <option value="sessao">Por Sessão</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddPaciente}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PacientePage;