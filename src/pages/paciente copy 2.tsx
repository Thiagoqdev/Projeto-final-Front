import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import NavBar from '../components/NavBar';

interface Paciente {
  nome: string;
  dataConsulta: string;
  telefone: string;
  formaPagamento: string;
  valorSessao?: number;
  quantidadeSessao?: number;
  situacaoFinanceiraSessao?: string;
  valorTotal?: number;
  desconto?: number;
  quantidadeParcelas?: number;
  diaVencimento?: number;
  situacaoFinanceiraMensal?: string;
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
    setNovoPaciente({
      nome: '',
      dataConsulta: '',
      telefone: '',
      formaPagamento: 'mensal',
    });
    setShowModal(false);
  };

  const handleClearInputs = () => {
    setNovoPaciente({
      nome: '',
      dataConsulta: '',
      telefone: '',
      formaPagamento: 'mensal',
    });
  };

  const handleDeletePaciente = (index: number) => {
    const updatedPacientes = pacientes.filter((_, i) => i !== index);
    setPacientes(updatedPacientes);
  };

  return (
    <div className="container mt-5">
      <NavBar />
      <h1 className="mb-4 text-primary">Lista de Pacientes</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Adicionar Novo Paciente
      </Button>

      <ul className="list-group mt-4">
        {pacientes.map((paciente, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{paciente.nome} - {paciente.telefone}</span>
            <div>
              <Button variant="info" className="me-2">Detalhes</Button>
              <Button variant="warning" className="me-2">Editar</Button>
              <Button variant="danger" onClick={() => handleDeletePaciente(index)}>Deletar</Button>
            </div>
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

            {novoPaciente.formaPagamento === 'sessao' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Valor da Sessão</Form.Label>
                  <Form.Control
                    type="number"
                    name="valorSessao"
                    value={novoPaciente.valorSessao || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantidade de Sessões</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantidadeSessao"
                    value={novoPaciente.quantidadeSessao || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Situação Financeira</Form.Label>
                  <Form.Select
                    name="situacaoFinanceiraSessao"
                    value={novoPaciente.situacaoFinanceiraSessao || ''}
                    onChange={handleInputChange}
                  >
                    <option value="pago">Pago</option>
                    <option value="aguardando">Aguardando Pagamento</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}

            {novoPaciente.formaPagamento === 'mensal' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Valor Total</Form.Label>
                  <Form.Control
                    type="number"
                    name="valorTotal"
                    value={novoPaciente.valorTotal || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Desconto (%)</Form.Label>
                  <Form.Select
                    name="desconto"
                    value={novoPaciente.desconto || ''}
                    onChange={handleInputChange}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={(i + 1) * 5}>
                        {(i + 1) * 5}%
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantidade de Parcelas</Form.Label>
                  <Form.Select
                    name="quantidadeParcelas"
                    value={novoPaciente.quantidadeParcelas || ''}
                    onChange={handleInputChange}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dia de Vencimento</Form.Label>
                  <Form.Control
                    type="number"
                    name="diaVencimento"
                    value={novoPaciente.diaVencimento || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Situação Financeira</Form.Label>
                  <Form.Select
                    name="situacaoFinanceiraMensal"
                    value={novoPaciente.situacaoFinanceiraMensal || ''}
                    onChange={handleInputChange}
                  >
                    <option value="pago">Pago</option>
                    <option value="aguardando">Aguardando Pagamento</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleClearInputs}>
            Limpar
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