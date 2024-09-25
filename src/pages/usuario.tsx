import { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
  usuarioId: number;
  login: string;
  senha: string;
  dataDoCadastro: string;
  ultimaAtualizacao: string;
  clientes: any[];
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get<Usuario[]>('http://localhost:5228/Usuario');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.usuarioId}>
            <p>ID: {usuario.usuarioId}</p>
            <p>Login: {usuario.login}</p>
            <p>Senha: {usuario.senha}</p>
            <p>Data do Cadastro: {usuario.dataDoCadastro}</p>
            <p>Última Atualização: {usuario.ultimaAtualizacao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;