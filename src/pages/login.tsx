import React, { useState } from 'react';
import { Form, Button, Card, Container, InputGroup, Alert } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState(''); // Corrige o nome para login
  const [senha, setSenha] = useState(''); // Corrige o nome para senha
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage(''); // Limpa a mensagem de erro

  try {
    console.log("Enviando requisição com os dados:", { login, senha });

    // Monta a URL com query parameters
    const url = `http://localhost:5228/Usuario/login?login=${encodeURIComponent(login)}&senha=${encodeURIComponent(senha)}`;

    // Faz a requisição GET ou POST com os parâmetros na URL
    const response = await fetch(url, {
      method: 'POST', // Pode ser GET se a API suportar
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta da API:", errorData);
      throw new Error(errorData.message || 'Erro no login. Verifique suas credenciais.');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

  } catch (error: any) {
    console.error("Erro ao tentar fazer login:", error.message);
    setErrorMessage(error.message || 'Erro inesperado. Tente novamente.');
  } finally {
    setLoading(false);
  }
};


  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '22rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="login">
              <Form.Label>Login</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Digite seu login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="senha">
              <Form.Label>Senha</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
