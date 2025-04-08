// components/Login.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.3rem;
  color: #4f46e5;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }
`;


const PageWrapper = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease;
`;

const LoginBox = styled.div`
  background: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  transition: border 0.3s ease;

  &:focus-within {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

const Icon = styled.div`
  margin-right: 0.75rem;
  color: #6b7280;
`;

const Input = styled.input`
  border: none;
  background: transparent;
  flex: 1;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s;

  &:hover {
    transform: scale(1.03);
    background-color: #4338ca;
  }
`;

const FooterText = styled.p`
  margin-top: 1.75rem;
  font-size: 0.9rem;
  color: #6b7280;

  a {
    color: #4f46e5;
    text-decoration: none;
    margin-left: 0.3rem;
    transition: color 0.2s;
    cursor: pointer;
    &:hover {
      color: #4338ca;
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: -0.5rem;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/usuarios');
      } else {
        setErro(data.erro || 'Email ou senha inválidos.');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor.');
    }
  };

  return (
    <PageWrapper>
      <LoginBox>
        <Title>Bem-vindo</Title>
        <Form onSubmit={handleLogin}>
          <InputWrapper>
            <Icon><FiMail size={20} /></Icon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FiLock size={20} /></Icon>
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </InputWrapper>
          <Button type="submit">Entrar</Button>
          {erro && <ErrorText>{erro}</ErrorText>}
        </Form>
        <FooterText>
         Esqueceu sua senha?
        <LinkButton onClick={() => navigate('/suporte')}>Ir para o suporte</LinkButton>
        </FooterText>

      </LoginBox>
    </PageWrapper>
  );
};




export default LoginPage;
