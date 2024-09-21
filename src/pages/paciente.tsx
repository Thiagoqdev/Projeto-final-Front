import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [novoPaciente, setNovoPaciente] = useState<Paciente>({
    nome: '',
    dataConsulta: '',
    telefone: '',
    formaPagamento: 'mensal',
  });
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [pacienteDetalhes, setPacienteDetalhes] = useState<Paciente | null>(null);

  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    if (pacienteEditando) {
      setPacienteEditando({ ...pacienteEditando, [name]: value });
    } else {
      setNovoPaciente({ ...novoPaciente, [name]: value });
    }
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

  const handleEditPaciente = (index: number) => {
    setEditIndex(index);
    setPacienteEditando(pacientes[index]);
    setShowEditModal(true);
  };

  const handleSaveEditPaciente = () => {
    if (editIndex !== null && pacienteEditando) {
      const updatedPacientes = [...pacientes];
      updatedPacientes[editIndex] = pacienteEditando;
      setPacientes(updatedPacientes);
      setShowEditModal(false);
    }
  };

  const handleDeletePaciente = (index: number) => {
    const updatedPacientes = pacientes.filter((_, i) => i !== index);
    setPacientes(updatedPacientes);
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
        <Table striped hover className="mt-4">
          <thead className="bg-info text-white">
            <tr>
              <th>PACIENTE</th>
              <th>TELEFONE PARA CONTATO</th>
              <th>DATA DA CONSULTA</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente, index) => (
              <tr key={index} className={`bg-${index % 2 === 0 ? 'light' : 'white'}`}>
                <td>{paciente.nome}</td>
                <td>{paciente.telefone}</td>
                <td>{paciente.dataConsulta}</td>
                <td>
                  <Button variant="info" className="me-2" onClick={() => handleViewDetalhes(index)}>Detalhes</Button>
                  <Button variant="warning" className="me-2" onClick={() => handleEditPaciente(index)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeletePaciente(index)}>Deletar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para Novo Paciente */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton className="bg-info text-white">
            <Modal.Title>Novo Paciente</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
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

              {/* Campos adicionais para "Por Sessão" */}
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

              {/* Campos adicionais para "Mensal" */}
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
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="warning" onClick={() => setNovoPaciente({
              nome: '',
              dataConsulta: '',
              telefone: '',
              formaPagamento: 'mensal',
            })}>
              Limpar
            </Button>
            <Button variant="success" onClick={handleAddPaciente}>
              Adicionar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Edição */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton className="bg-info text-white">
    <Modal.Title>Editar Paciente</Modal.Title>
  </Modal.Header>
  <Modal.Body className="bg-light">
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nome do Paciente</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={pacienteEditando?.nome || ''}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Data da Consulta</Form.Label>
        <Form.Control
          type="date"
          name="dataConsulta"
          value={pacienteEditando?.dataConsulta || ''}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Telefone para Contato</Form.Label>
        <Form.Control
          type="tel"
          name="telefone"
          value={pacienteEditando?.telefone || ''}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Forma de Pagamento</Form.Label>
        <Form.Select
          name="formaPagamento"
          value={pacienteEditando?.formaPagamento || 'mensal'}
          onChange={handleInputChange}
        >
          <option value="mensal">Mensal</option>
          <option value="sessao">Por Sessão</option>
        </Form.Select>
      </Form.Group>

      {/* Campos adicionais para "Por Sessão" */}
      {pacienteEditando?.formaPagamento === 'sessao' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Valor da Sessão</Form.Label>
            <Form.Control
              type="number"
              name="valorSessao"
              value={pacienteEditando.valorSessao || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantidade de Sessões</Form.Label>
            <Form.Control
              type="number"
              name="quantidadeSessao"
              value={pacienteEditando.quantidadeSessao || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Situação Financeira Sessão</Form.Label>
            <Form.Select
              name="situacaoFinanceiraSessao"
              value={pacienteEditando.situacaoFinanceiraSessao || ''}
              onChange={handleInputChange}
            >
              <option value="pago">Pago</option>
              <option value="aguardando">Aguardando Pagamento</option>
            </Form.Select>
          </Form.Group>
        </>
      )}

      {/* Campos adicionais para "Mensal" */}
      {pacienteEditando?.formaPagamento === 'mensal' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Valor Total</Form.Label>
            <Form.Control
              type="number"
              name="valorTotal"
              value={pacienteEditando.valorTotal || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Desconto (%)</Form.Label>
            <Form.Select
              name="desconto"
              value={pacienteEditando.desconto || ''}
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
              value={pacienteEditando.quantidadeParcelas || ''}
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
              value={pacienteEditando.diaVencimento || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Situação Financeira Mensal</Form.Label>
            <Form.Select
              name="situacaoFinanceiraMensal"
              value={pacienteEditando.situacaoFinanceiraMensal || ''}
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
  <Modal.Footer className="bg-light">
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      Cancelar
    </Button>
    <Button variant="success" onClick={handleSaveEditPaciente}>
      Salvar
    </Button>
  </Modal.Footer>
</Modal>
        {/* Modal para Detalhes do Paciente */}
        {pacienteDetalhes && (
          <Modal show={!!pacienteDetalhes} onHide={() => setPacienteDetalhes(null)}>
            <Modal.Header closeButton className="bg-info text-white">
              <Modal.Title>Detalhes do Paciente</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
              <p><strong>Nome:</strong> {pacienteDetalhes.nome}</p>
              <p><strong>Data da Consulta:</strong> {pacienteDetalhes.dataConsulta}</p>
              <p><strong>Telefone:</strong> {pacienteDetalhes.telefone}</p>
              <p><strong>Forma de Pagamento:</strong> {pacienteDetalhes.formaPagamento}</p>
              {pacienteDetalhes.formaPagamento === 'sessao' && (
                <>
                  <p><strong>Valor da Sessão:</strong> {pacienteDetalhes.valorSessao}</p>
                  <p><strong>Quantidade de Sessões:</strong> {pacienteDetalhes.quantidadeSessao}</p>
                  <p><strong>Situação Financeira Sessão:</strong> {pacienteDetalhes.situacaoFinanceiraSessao}</p>
                </>
              )}
              {pacienteDetalhes.formaPagamento === 'mensal' && (
                <>
                  <p><strong>Valor Total:</strong> {pacienteDetalhes.valorTotal}</p>
                  <p><strong>Desconto:</strong> {pacienteDetalhes.desconto}</p>
                  <p><strong>Quantidade de Parcelas:</strong> {pacienteDetalhes.quantidadeParcelas}</p>
                  <p><strong>Dia de Vencimento:</strong> {pacienteDetalhes.diaVencimento}</p>
                  <p><strong>Situação Financeira Mensal:</strong> {pacienteDetalhes.situacaoFinanceiraMensal}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <Button variant="secondary" onClick={() => setPacienteDetalhes(null)}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PacientePage;