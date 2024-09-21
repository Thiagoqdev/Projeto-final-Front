import React from 'react';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '22rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control type="text" placeholder="Enter username" />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control type="password" placeholder="Password" />
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;