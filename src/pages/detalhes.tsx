import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface Paciente {
  id: string;
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

const DetalhesPaciente: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    if (id) {
      // Simulação de busca do paciente pelo ID
      const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
      const pacienteEncontrado = pacientes.find((p: Paciente) => p.id === id);
      setPaciente(pacienteEncontrado);
    }
  }, [id]);

  if (!paciente) {
    return <div>Carregando...</div>;
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-info text-white">
          <h2 className="mb-0">Detalhes do Paciente</h2>
        </Card.Header>
        <Card.Body className="bg-light">
          <Row>
            <Col md={6}>
              <h4 className="text-primary">Informações Pessoais</h4>
              <p><strong>Nome:</strong> {paciente.nome}</p>
              <p><strong>Data da Consulta:</strong> {paciente.dataConsulta}</p>
              <p><strong>Telefone:</strong> {paciente.telefone}</p>
            </Col>
            <Col md={6}>
              <h4 className="text-primary">Informações Financeiras</h4>
              <p><strong>Forma de Pagamento:</strong> {paciente.formaPagamento}</p>
              {paciente.formaPagamento === 'sessao' && (
                <>
                  <p><strong>Valor da Sessão:</strong> {paciente.valorSessao}</p>
                  <p><strong>Quantidade de Sessões:</strong> {paciente.quantidadeSessao}</p>
                  <p><strong>Situação Financeira Sessão:</strong> {paciente.situacaoFinanceiraSessao}</p>
                </>
              )}
              {paciente.formaPagamento === 'mensal' && (
                <>
                  <p><strong>Valor Total:</strong> {paciente.valorTotal}</p>
                  <p><strong>Desconto:</strong> {paciente.desconto}</p>
                  <p><strong>Quantidade de Parcelas:</strong> {paciente.quantidadeParcelas}</p>
                  <p><strong>Dia de Vencimento:</strong> {paciente.diaVencimento}</p>
                  <p><strong>Situação Financeira Mensal:</strong> {paciente.situacaoFinanceiraMensal}</p>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="bg-light text-end">
          <Button variant="secondary" onClick={() => router.back()}>
            Voltar
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default DetalhesPaciente;