import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import NavBar from '../components/NavBar';
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
                <td>{paciente.dataDaConsulta}</td>
                <td>
                  <Button variant="info" className="me-2" onClick={() => handleViewDetalhes(index)}>
                    Detalhes
                  </Button>
                  <Button variant="warning" className="me-2" onClick={() => handleEditPaciente(index)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDeletePaciente(paciente.nome)}>
                    Deletar
                  </Button>
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
                  name="dataDaConsulta"
                  value={novoPaciente.dataDaConsulta}
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
                  name="categoria"
                  value={novoPaciente.categoria || 'Mensal'}
                  onChange={handleInputChange}
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Sessao">Por Sessão</option>
                </Form.Select>
              </Form.Group>

              {novoPaciente.categoria === 'Sessao' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor da Sessão</Form.Label>
                    <Form.Control
                      type="number"
                      name="valorDaSessao"
                      value={novoPaciente.valorDaSessao || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade de Sessões</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantidadeDeSessao"
                      value={novoPaciente.quantidadeDeSessao || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Situação Financeira</Form.Label>
                    <Form.Select
                      name="situacaoFinanceira"
                      value={novoPaciente.situacaoFinanceira || ''}
                      onChange={handleInputChange}
                    >
                      <option value="Pago">Pago</option>
                      <option value="Aguardando">Aguardando Pagamento</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              {novoPaciente.categoria === 'Mensal' && (
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
                    <Form.Label>Dia de Vencimento</Form.Label>
                    <Form.Control
                      type="text"
                      name="vencimento"
                      value={novoPaciente.vencimento || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Situação Financeira</Form.Label>
                    <Form.Select
                      name="situacaoFinanceira"
                      value={novoPaciente.situacaoFinanceira || ''}
                      onChange={handleInputChange}
                    >
                      <option value="Pago">Pago</option>
                      <option value="Aguardando">Aguardando Pagamento</option>
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
                  name="dataDaConsulta"
                  value={pacienteEditando?.dataDaConsulta || ''}
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
                  name="categoria"
                  value={pacienteEditando?.categoria || 'Mensal'}
                  onChange={handleInputChange}
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Sessao">Por Sessão</option>
                </Form.Select>
              </Form.Group>

              {pacienteEditando?.categoria === 'Sessao' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor da Sessão</Form.Label>
                    <Form.Control
                      type="number"
                      name="valorDaSessao"
                      value={pacienteEditando.valorDaSessao || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade de Sessões</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantidadeDeSessao"
                      value={pacienteEditando.quantidadeDeSessao || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Situação Financeira</Form.Label>
                    <Form.Select
                      name="situacaoFinanceira"
                      value={pacienteEditando?.situacaoFinanceira || ''}
                      onChange={handleInputChange}
                    >
                      <option value="Pago">Pago</option>
                      <option value="Aguardando">Aguardando Pagamento</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              {pacienteEditando?.categoria === 'Mensal' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor Total</Form.Label>
                    <Form.Control
                      type="number"
                      name="valorTotal"
                      value={pacienteEditando?.valorTotal || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Desconto (%)</Form.Label>
                    <Form.Select
                      name="desconto"
                      value={pacienteEditando?.desconto || ''}
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
                    <Form.Label>Dia de Vencimento</Form.Label>
                    <Form.Control
                      type="text"
                      name="vencimento"
                      value={pacienteEditando?.vencimento || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Situação Financeira</Form.Label>
                    <Form.Select
                      name="situacaoFinanceira"
                      value={pacienteEditando?.situacaoFinanceira || ''}
                      onChange={handleInputChange}
                    >
                      <option value="Pago">Pago</option>
                      <option value="Aguardando">Aguardando Pagamento</option>
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
              <p><strong>Data da Consulta:</strong> {pacienteDetalhes.dataDaConsulta}</p>
              <p><strong>Telefone:</strong> {pacienteDetalhes.telefone}</p>
              <p><strong>Forma de Pagamento:</strong> {pacienteDetalhes.categoria}</p>
              {pacienteDetalhes.categoria === 'Sessao' && (
                <>
                  <p><strong>Valor da Sessão:</strong> {pacienteDetalhes.valorDaSessao}</p>
                  <p><strong>Quantidade de Sessões:</strong> {pacienteDetalhes.quantidadeDeSessao}</p>
                  <p><strong>Situação Financeira Sessão:</strong> {pacienteDetalhes.situacaoFinanceira}</p>
                </>
              )}
              {pacienteDetalhes.categoria === 'Mensal' && (
                <>
                  <p><strong>Valor Total:</strong> {pacienteDetalhes.valorTotal}</p>
                  <p><strong>Desconto:</strong> {pacienteDetalhes.desconto}</p>
                  <p><strong>Dia de Vencimento:</strong> {pacienteDetalhes.vencimento}</p>
                  <p><strong>Situação Financeira Mensal:</strong> {pacienteDetalhes.situacaoFinanceira}</p>
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