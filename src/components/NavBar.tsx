import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100" style={{ marginTop: 0 }}>
      <div className="container-fluid p-0">
        <Link href="/" className="navbar-brand ms-3">
          Asoftware
        </Link>
        
        <button
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Início
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/paciente" className="nav-link">
                Pacientes
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link">
                Sair
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;