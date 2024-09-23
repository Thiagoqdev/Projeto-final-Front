import React, { useState } from 'react';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
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

    try {
      // Faz a requisição GET para buscar todos os usuários
      const response = await axios.get<Usuario[]>('http://localhost:5228/Usuario');

      // Verifica se o login e a senha correspondem a algum usuário retornado
      const usuarioEncontrado = response.data.find(
        (usuario) => usuario.login === username && usuario.senha === password
      );

      if (usuarioEncontrado) {

        router.push('/paciente');
      } else {

        setError('Usuário ou senha inválidos');
      }
    } catch (err) {
      // Define uma mensagem de erro em caso de erro na requisição
      setError('Erro ao tentar fazer login. Tente novamente pois esta com problema a api.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
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
    </Container>
  );
};

export default LoginPage;