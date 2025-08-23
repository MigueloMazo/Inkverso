import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BarraNavegacion from '../componentes/BarraNavegacion';
import Footer from '../componentes/Footer';
import '../assets/styles/forgot-password.css';

export default function ForgotPassword() {
  const navigate = useNavigate();  // Hook de React Router para redirigir entre vistas
  const [step, setStep] = useState(1); // Estado para manejar las etapas del flujo (1: pedir email, 2: ingresar código y nueva pass)
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [simulationCode, setSimulationCode] = useState(''); // Estado para mostrar el código

  const handleSendCode = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/auth/send-reset-code',
        { email }
      );
      setSimulationCode(res.data.code); // Guardamos el código para mostrarlo
      setStep(2);
    } catch (err) {
      console.error('💥 Error al enviar código:', err);
      alert(err.response?.data?.error || 'Error al enviar el código.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return alert('Las contraseñas no coinciden.');

    try {
      await axios.post('http://localhost:4000/api/auth/reset-password', {
        email,
        code,
        newPassword,
      });
      alert('Contraseña actualizada con éxito.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cambiar la contraseña.');
    }
  };

  return (
    <>
      <head>
        <title>Inkverso – Recuperar Contraseña</title>
      </head>

      <BarraNavegacion />

      <main className="forgot-container">
        <form
          className="forgot-form"
          onSubmit={
            step === 1
              ? (e) => {
                  e.preventDefault();
                  handleSendCode();
                }
              : handleResetPassword
          }
        >
          <h2>Recuperar Contraseña</h2>

          {step === 1 && (
            <>
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Enviar código</button>
            </>
          )}

          {step === 2 && (
            <>
              

              {/* Mostramos el correo donde se enviara el código de simulación */}
              {simulationCode && (
                <div className="simulation-code-container">
                  <p>
                    {email}
                  </p>
                </div>
              )}

              <label htmlFor="code">Código</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <label htmlFor="new-password">Nueva contraseña</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <label htmlFor="confirm-password">Repetir contraseña</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit">Actualizar contraseña</button>
              <div className="forgot-form__resend">
                <span>¿No recibiste el código?</span>{' '}
                <button type="button" onClick={handleSendCode}>
                  Reenviar
                </button>
              </div>
            </>
          )}
        </form>
      </main>

      <Footer />
    </>
  );
}