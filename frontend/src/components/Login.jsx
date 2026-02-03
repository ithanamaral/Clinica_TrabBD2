import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Activity } from 'lucide-react';
import '@/styles/Login.css';

export const Login = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('medico');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const success = login(email, password, role);
    if (success) {
      console.log('Login realizado com sucesso!');
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-icon">
            <Activity size={32} />
          </div>
          <div>
            <h1 className="login-title">Sistema de Gestão Clínica</h1>
            <p className="login-description">
              Acesse sua conta para continuar
            </p>
          </div>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="label">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="role" className="label">Perfil de Acesso</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select"
              >
                <option value="medico">Médico</option>
                <option value="enfermeiro">Enfermeiro</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Entrar
            </button>
          </form>

          <div className="login-help-text">
            <p>Utilize qualquer email e senha para demonstração</p>
          </div>
        </div>
      </div>
    </div>
  );
};
