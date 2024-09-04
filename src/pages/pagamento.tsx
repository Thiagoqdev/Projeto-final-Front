import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Paciente {
  nome: string;
  dataConsulta: string;
  telefone: string;
  formaPagamento: string;
}

interface Pagamento {
  paciente: string;
  valorTotal: number;
  desconto: number;
  parcelas: number;
  dataVencimento: string;
  status: 'pago' | 'aguardando';
}

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PagamentoPage: React.FC = () => {
  const [pacientes] = useState<Paciente[]>([
    { nome: 'João Silva', dataConsulta: '2024-09-01', telefone: '123456789', formaPagamento: 'mensal' },
    { nome: 'Maria Oliveira', dataConsulta: '2024-09-02', telefone: '987654321', formaPagamento: 'sessao' },
  ]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [novoPagamento, setNovoPagamento] = useState<Pagamento>({
    paciente: '',
    valorTotal: 0,
    desconto: 0,
    parcelas: 1,
    dataVencimento: '',
    status: 'aguardando',
  });

  const handlePacienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pacienteNome = e.target.value;
    setSelectedPaciente(pacienteNome);
    const paciente = pacientes.find(p => p.nome === pacienteNome);
    if (paciente?.formaPagamento === 'mensal') {
      setNovoPagamento({ ...novoPagamento, paciente: pacienteNome });
      setShowModal(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setNovoPagamento({ ...novoPagamento, [name]: value });
  };

  const handleAddPagamento = () => {
    setPagamentos([...pagamentos, novoPagamento]);
    setShowModal(false);
  };

  const handleUpdatePagamento = (index: number) => {
    const updatedPagamentos = pagamentos.map((pagamento, i) => (i === index ? novoPagamento : pagamento));
    setPagamentos(updatedPagamentos);
  };

  const handleRemovePagamento = (index: number) => {
    const updatedPagamentos = pagamentos.filter((_, i) => i !== index);
    setPagamentos(updatedPagamentos);
  };

  const handleClearPagamento = () => {
    setNovoPagamento({
      paciente: '',
      valorTotal: 0,
      desconto: 0,
      parcelas: 1,
      dataVencimento: '',
      status: 'aguardando',
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Página de Pagamento</h1>
      <Form.Group className="mb-3">
        <Form.Label>Selecione o Paciente</Form.Label>
        <Form.Select onChange={handlePacienteChange} value={selectedPaciente}>
          <option value="">Selecione um paciente</option>
          {pacientes.map((paciente, index) => (
            <option key={index} value={paciente.nome}>
              {paciente.nome}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <ul className="list-group mt-4">
        {pagamentos.map((pagamento, index) => (
          <li key={index} className="list-group-item">
            {pagamento.paciente} - Valor: {pagamento.valorTotal} - Desconto: {pagamento.desconto}%
            - Parcelas: {pagamento.parcelas} - Vencimento: {pagamento.dataVencimento} - Status: {pagamento.status}
            <Button variant="warning" onClick={() => handleUpdatePagamento(index)}>
              Atualizar
            </Button>
            <Button variant="danger" onClick={() => handleRemovePagamento(index)}>
              Remover
            </Button>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pagamento Mensal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Valor Total</Form.Label>
              <Form.Control
                type="number"
                name="valorTotal"
                value={novoPagamento.valorTotal}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Desconto (%)</Form.Label>
              <Form.Select
                name="desconto"
                value={novoPagamento.desconto}
                onChange={handleInputChange}
              >
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((desconto) => (
                  <option key={desconto} value={desconto}>
                    {desconto}%
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parcelas</Form.Label>
              <Form.Select
                name="parcelas"
                value={novoPagamento.parcelas}
                onChange={handleInputChange}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((parcela) => (
                  <option key={parcela} value={parcela}>
                    {parcela}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data de Vencimento</Form.Label>
              <Form.Control
                type="date"
                name="dataVencimento"
                value={novoPagamento.dataVencimento}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Pago"
                checked={novoPagamento.status === 'pago'}
                onChange={(e) =>
                  setNovoPagamento({ ...novoPagamento, status: e.target.checked ? 'pago' : 'aguardando' })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddPagamento}>
            Adicionar
          </Button>
          <Button variant="danger" onClick={handleClearPagamento}>
            Limpar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PagamentoPage;