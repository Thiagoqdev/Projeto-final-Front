import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Paciente } from '../types/types';

interface PacientesTableProps {
  pacientes: Paciente[];
  onViewDetalhes: (index: number) => void;
  onEditPaciente: (index: number) => void;
  onDeletePaciente: (index: number) => void;
}

const PacientesTable: React.FC<PacientesTableProps> = ({ pacientes, onViewDetalhes, onEditPaciente, onDeletePaciente }) => {
  return (
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
              <Button variant="info" className="me-2" onClick={() => onViewDetalhes(index)}>Detalhes</Button>
              <Button variant="warning" className="me-2" onClick={() => onEditPaciente(index)}>Editar</Button>
              <Button variant="danger" onClick={() => onDeletePaciente(index)}>Deletar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PacientesTable;