import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Paciente } from '../types/types';

// Generalizando o tipo de evento para cobrir todos os tipos de elementos de formulário
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface PacienteModalProps {
  show: boolean;
  onHide: () => void;
  paciente: Paciente;
  onInputChange: (e: React.ChangeEvent<FormControlElement>) => void;
  onSave: () => void;
  isEditing: boolean;
}

const PacienteModal: React.FC<PacienteModalProps> = ({ show, onHide, paciente, onInputChange, onSave, isEditing }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title>{isEditing ? 'Editar Paciente' : 'Novo Paciente'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome do Paciente</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={paciente.nome}
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data da Consulta</Form.Label>
            <Form.Control
              type="date"
              name="dataConsulta"
              value={paciente.dataConsulta}
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefone para Contato</Form.Label>
            <Form.Control
              type="tel"
              name="telefone"
              value={paciente.telefone}
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Forma de Pagamento</Form.Label>
            <Form.Select
              name="formaPagamento"
              value={paciente.formaPagamento}
              onChange={onInputChange}
            >
              <option value="mensal">Mensal</option>
              <option value="sessao">Por Sessão</option>
            </Form.Select>
          </Form.Group>

          {/* Campos adicionais para "Por Sessão" */}
          {paciente.formaPagamento === 'sessao' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Valor da Sessão</Form.Label>
                <Form.Control
                  type="number"
                  name="valorSessao"
                  value={paciente.valorSessao || ''}
                  onChange={onInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantidade de Sessões</Form.Label>
                <Form.Control
                  type="number"
                  name="quantidadeSessao"
                  value={paciente.quantidadeSessao || ''}
                  onChange={onInputChange}
                />
              </Form.Group>
            </>
          )}

          {/* Campos adicionais para "Mensal" */}
          {paciente.formaPagamento === 'mensal' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Valor Total</Form.Label>
                <Form.Control
                  type="number"
                  name="valorTotal"
                  value={paciente.valorTotal || ''}
                  onChange={onInputChange}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={onSave}>
          {isEditing ? 'Salvar' : 'Adicionar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PacienteModal;