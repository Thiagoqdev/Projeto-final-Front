import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Paciente } from '../types/types';

interface PacienteDetalhesModalProps {
  show: boolean;
  onHide: () => void;
  paciente: Paciente | null;
}

const PacienteDetalhesModal: React.FC<PacienteDetalhesModalProps> = ({ show, onHide, paciente }) => {
  if (!paciente) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title>Detalhes do Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <p><strong>Nome:</strong> {paciente.nome}</p>
        <p><strong>Data da Consulta:</strong> {paciente.dataConsulta}</p>
        <p><strong>Telefone:</strong> {paciente.telefone}</p>
        {/* Exibir demais campos conforme a forma de pagamento */}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PacienteDetalhesModal;