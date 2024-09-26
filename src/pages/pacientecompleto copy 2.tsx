import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import NavBar from "../components/NavBar";
import axios from "axios";

interface Paciente {
  clienteId?: number;
  nome: string;
  dataDaConsulta: string;
  telefone: string;
  formaPagamento: string;
  valorDaSessao?: number;
  categoria?: string;
  quantidadeDeSessao?: number;
  situacaoFinanceira?: string;
  valorPago?: number;
  valorTotal?: number;
  desconto?: number;
  quantidadeParcelas?: number;
  vencimento?: string;
  situacaoFinanceiraMensal?: string;
}

type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const PacientePage: React.FC = () => {
  const [showModalNovoPaciente, setShowModalNovoPaciente] = useState(false);
  const [showModalDetalhesPaciente, setShowModalDetalhesPaciente] =
    useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [novoPaciente, setNovoPaciente] = useState<Paciente>({
    nome: "",
    dataDaConsulta: "",
    telefone: "",
    formaPagamento: "sessao",
    categoria: "Sessão",
    valorDaSessao: 500,
    quantidadeDeSessao: 50,
    valorTotal: 0,
    desconto: 0,
    valorPago: 0,
    vencimento: "15",
    situacaoFinanceira: "pago",
  });
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(
    null
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [pacienteDetalhes, setPacienteDetalhes] = useState<Paciente | null>(
    null
  );

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get<Paciente[]>(
          "http://localhost:5228/Cliente/TabelaSimples"
        );
        setPacientes(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar pacientes:", error.message);
      }
    };
    fetchPacientes();
  }, []);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get<Paciente[]>(
          "http://localhost:5228/Cliente/TabelaDetalhada"
        );
        setPacientes(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar pacientes:", error.message);
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
      const response = await axios.post(
        "http://localhost:5228/Cliente/AdicionarCliente",
        {
          ...novoPaciente,
          valorTotal: "",
          desconto: "",
          valorPago: "",
          vencimento: novoPaciente.vencimento || "5",
          situacaoFinanceira: novoPaciente.situacaoFinanceira || "pendente",
          dataDoCadastro: new Date().toISOString(),
        }
      );
      console.log("Paciente adicionado:", response.data);
      setShowModalNovoPaciente(false);
      setNovoPaciente({
        nome: "",
        dataDaConsulta: "",
        telefone: "",
        formaPagamento: "mensal",
      });

  } catch (error) {
    console.error("Erro ao adicionar paciente:", error);
  }
};

  const handleDeletePaciente = async (index: number) => {
    const paciente = pacientes[index];
    if (!paciente || !paciente.nome) return;
    
    try {
      await axios.delete(`http://localhost:5228/Cliente/RemoverCliente?nome=${paciente.nome}`);
      const updatedPacientes = pacientes.filter((_, i) => i !== index);
      setPacientes(updatedPacientes);
      console.log("Paciente excluído:", paciente.nome);
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
    }
  };

  const handleEditPaciente = async () => {
    if (!pacienteEditando || !pacienteEditando.clienteId) return;
  
    try {
      const response = await axios.put(
        `http://localhost:5228/Cliente/AtualizarCliente?id=${pacienteEditando.clienteId}`,
        {
          clienteId: pacienteEditando.clienteId,
          nome: pacienteEditando.nome,
          telefone: pacienteEditando.telefone,
          dataDaConsulta: pacienteEditando.dataDaConsulta,
          categoria: pacienteEditando.categoria || "mensal",
          valorDaSessao: pacienteEditando.valorDaSessao || 0,
          quantidadeDeSessao: pacienteEditando.quantidadeDeSessao || 0,
          valorTotal: pacienteEditando.valorTotal || 0,
          desconto: pacienteEditando.desconto || 0,
          valorPago: pacienteEditando.valorPago || 0,
          vencimento: pacienteEditando.vencimento || "8",
          situacaoFinanceira: pacienteEditando.situacaoFinanceira || "pendente",
          ultimaAtualizacao: new Date().toISOString(),
          dataDoCadastro: new Date().toISOString(),
        }
      );
      console.log("Paciente atualizado:", response.data);
      setShowEditModal(false);
      setPacienteEditando(null);
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
    }
  };



  const handleEditClick = (paciente: Paciente) => {
    setPacienteEditando(paciente);
    setShowEditModal(true);
  };


  const handleViewDetalhes = (index: number) => {
    setPacienteDetalhes(pacientes[index]);
    setShowModalDetalhesPaciente(true);
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h1 className="text-center flex-grow-1">Pacientes</h1>
          <Button
            variant="success"
            onClick={() => setShowModalNovoPaciente(true)}
          >
            Adicionar Novo Paciente
          </Button>
        </div>

        {/* lista de paciente */}
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
              <tr
                key={index}
                className={`bg-${index % 2 === 0 ? "light" : "white"}`}
              >
                <td>{paciente.nome}</td>
                <td>{paciente.telefone}</td>
                <td>{new Date(paciente.dataDaConsulta).toLocaleString()}</td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetalhes(index)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEditClick(paciente)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePaciente(index)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para Novo Paciente */}
        <Modal
          show={showModalNovoPaciente}
          onHide={() => setShowModalNovoPaciente(false)}
        >
          <Modal.Header closeButton className="bg-info text-white">
            <Modal.Title>Novo Paciente</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="nome">Nome do Paciente</Form.Label>
                <Form.Control
                  type="text"
                  id="nome"
                  name="nome"
                  value={novoPaciente.nome}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="dataDaConsulta">
                  Data e Hora da Consulta
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  id="dataDaConsulta"
                  name="dataDaConsulta"
                  value={novoPaciente.dataDaConsulta}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="telefone">
                  Telefone para Contato
                </Form.Label>
                <Form.Control
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={novoPaciente.telefone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="formaPagamento">
                  Forma de Pagamento
                </Form.Label>
                <Form.Select
                  id="formaPagamento"
                  name="formaPagamento"
                  value={novoPaciente.formaPagamento}
                  onChange={handleInputChange}
                >
                  <option value="mensal">Mensal</option>
                  <option value="sessao">Por Sessão</option>
                </Form.Select>
              </Form.Group>

              {novoPaciente.formaPagamento === "sessao" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="valorDaSessao">
                      Valor da Sessão
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="valorDaSessao"
                      name="valorDaSessao"
                      value={novoPaciente.valorDaSessao || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="quantidadeDeSessao">
                      Quantidade de Sessões
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="quantidadeDeSessao"
                      name="quantidadeDeSessao"
                      value={novoPaciente.quantidadeDeSessao || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="situacaoFinanceira">
                      Situação Financeira
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="situacaoFinanceira"
                      name="situacaoFinanceira"
                      value={novoPaciente.situacaoFinanceira || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </>
              )}

              {novoPaciente.formaPagamento === "mensal" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="valorTotal">Valor Total</Form.Label>
                    <Form.Control
                      type="number"
                      id="valorTotal"
                      name="valorTotal"
                      value={novoPaciente.valorTotal || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="desconto">Desconto (%)</Form.Label>
                    <Form.Select
                      id="desconto"
                      name="desconto"
                      value={novoPaciente.desconto || ""}
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
                    <Form.Label htmlFor="quantidadeParcelas">
                      Quantidade de Parcelas
                    </Form.Label>
                    <Form.Select
                      id="quantidadeParcelas"
                      name="quantidadeParcelas"
                      value={novoPaciente.quantidadeParcelas || ""}
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
                    <Form.Label htmlFor="vencimento">
                      Dia de Vencimento
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="vencimento"
                      name="vencimento"
                      value={novoPaciente.vencimento || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="situacaoFinanceiraMensal">
                      Situação Financeira
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="situacaoFinanceiraMensal"
                      name="situacaoFinanceiraMensal"
                      value={novoPaciente.situacaoFinanceiraMensal || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button
              variant="secondary"
              onClick={() => setShowModalNovoPaciente(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="warning"
              onClick={() =>
                setNovoPaciente({
                  nome: "",
                  dataDaConsulta: "",
                  telefone: "",
                  formaPagamento: "mensal",
                })
              }
            >
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
            {pacienteEditando && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="edit-nome">Nome do Paciente</Form.Label>
                  <Form.Control
                    type="text"
                    id="edit-nome"
                    name="nome"
                    value={pacienteEditando.nome}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="edit-dataDaConsulta">
                    Data e Hora da Consulta
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    id="edit-dataDaConsulta"
                    name="dataDaConsulta"
                    value={pacienteEditando.dataDaConsulta}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="edit-telefone">
                    Telefone para Contato
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    id="edit-telefone"
                    name="telefone"
                    value={pacienteEditando.telefone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="edit-formaPagamento">
                    Forma de Pagamento
                  </Form.Label>
                  <Form.Select
                    id="edit-formaPagamento"
                    name="formaPagamento"
                    value={pacienteEditando.formaPagamento}
                    onChange={handleInputChange}
                  >
                    <option value="mensal">Mensal</option>
                    <option value="sessao">Por Sessão</option>
                  </Form.Select>
                </Form.Group>

                {pacienteEditando.formaPagamento === "sessao" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="edit-valorDaSessao">
                        Valor da Sessão
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="edit-valorDaSessao"
                        name="valorDaSessao"
                        value={pacienteEditando.valorDaSessao || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="edit-quantidadeDeSessao">
                        Quantidade de Sessões
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="edit-quantidadeDeSessao"
                        name="quantidadeDeSessao"
                        value={pacienteEditando.quantidadeDeSessao || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="edit-situacaoFinanceira">
                        Situação Financeira
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="edit-situacaoFinanceira"
                        name="situacaoFinanceira"
                        value={pacienteEditando.situacaoFinanceira || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </>
                )}

                {pacienteEditando.formaPagamento === "mensal" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="edit-valorTotal">
                        Valor Total
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="edit-valorTotal"
                        name="valorTotal"
                        value={pacienteEditando.valorTotal || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="edit-desconto">
                        Desconto (%)
                      </Form.Label>
                      <Form.Select
                        id="edit-desconto"
                        name="desconto"
                        value={pacienteEditando.desconto || ""}
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
                      <Form.Label htmlFor="edit-quantidadeParcelas">
                        Quantidade de Parcelas
                      </Form.Label>
                      <Form.Select
                        id="edit-quantidadeParcelas"
                        name="quantidadeParcelas"
                        value={pacienteEditando.quantidadeParcelas || ""}
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
                      <Form.Label htmlFor="edit-vencimento">
                        Dia de Vencimento
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="edit-vencimento"
                        name="vencimento"
                        value={pacienteEditando.vencimento || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="edit-situacaoFinanceiraMensal">
                        Situação Financeira
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="edit-situacaoFinanceiraMensal"
                        name="situacaoFinanceiraMensal"
                        value={pacienteEditando.situacaoFinanceiraMensal || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </>
                )}
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleEditPaciente}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Detalhes do Paciente */}
        {pacienteDetalhes && (
          <Modal
            show={showModalDetalhesPaciente}
            onHide={() => setShowModalDetalhesPaciente(false)}
          >
            <Modal.Header closeButton className="bg-info text-white">
              <Modal.Title>Detalhes do Paciente</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
              <p>
                <strong>Nome:</strong> {pacienteDetalhes.nome}
              </p>
              <p>
                <strong>Telefone:</strong> {pacienteDetalhes.telefone}
              </p>
              <p>
                <strong>Data da Consulta:</strong>{" "}
                {new Date(pacienteDetalhes.dataDaConsulta).toLocaleDateString()}
              </p>
              <p>
                <strong>Categoria:</strong> {pacienteDetalhes.categoria}
              </p>
              <p>
                <strong>Valor da Sessão:</strong> R${" "}
                {pacienteDetalhes.valorDaSessao !== undefined
                  ? pacienteDetalhes.valorDaSessao.toFixed(2)
                  : "N/A"}
              </p>
              <p>
                <strong>Quantidade de Sessões:</strong>{" "}
                {pacienteDetalhes.quantidadeDeSessao}
              </p>
              <p>
                <strong>Valor Total:</strong>{" "}
                {pacienteDetalhes.valorTotal !== undefined
                  ? pacienteDetalhes.valorTotal.toFixed(2)
                  : "N/A"}
              </p>
              <p>
                <strong>Desconto:</strong>{" "}
                {pacienteDetalhes.desconto
                  ? (pacienteDetalhes.desconto * 100).toFixed(0) + "%"
                  : "0%"}
              </p>
              <p>
                <strong>Valor Pago:</strong>{" "}
                {pacienteDetalhes.valorPago !== undefined
                  ? pacienteDetalhes.valorPago.toFixed(2)
                  : "N/A"}
              </p>
              <p>
                <strong>Dia de Vencimento:</strong>{" "}
                {pacienteDetalhes.vencimento}
              </p>
              <p>
                <strong>Situação Financeira:</strong>{" "}
                {pacienteDetalhes.situacaoFinanceira}
              </p>
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <Button
                variant="secondary"
                onClick={() => setShowModalDetalhesPaciente(false)}
              >
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
