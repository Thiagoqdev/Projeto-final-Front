import React, { useState } from 'react';
import { Form, Button, Card, Container, InputGroup, Row, Col } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Usuario {
  usuarioId: number;
  login: string;
  senha: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const router = useRouter(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setLoading(true); 
    setError(null); 


  function setErrorMessage(arg0: any) {
     throw new Error('Function not implemented.');
    }

    try {
      // Faz a requisição GET para buscar todos os usuários
      const response = await axios.get<Usuario[]>('http://localhost:5228/Usuario');

      // Verifica se o login e a senha correspondem a algum usuário retornado
      const usuarioEncontrado = response.data.find(
        (usuario) => usuario.login === username && usuario.senha === password
      );

      if (usuarioEncontrado) {
        router.push('/pacientecompleto');
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch (error: any) {
      console.error("Erro ao tentar fazer login:", error.message);
      setErrorMessage(error.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div style={{ width: '100%', height: '100%', borderRight: '1px solid #ccc' }}>
            <img src="/img/icon.jpeg" alt="Imagem" style={{ width: '100%', height: 'auto' }} />
          </div>
        </Col>
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <Card style={{ width: '22rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} 
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Carregando...' : 'Entrar'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;


