import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { X } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: #1e1e2d;
  padding: 2.5rem;
  border-radius: 12px;
  width: 480px;
  max-width: 95%;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  border: 1px solid #2d2d3a;

  @keyframes slideUp {
    from { 
      transform: translateY(20px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  background: #2d2d3a;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #a1a1b5;
  transition: all 0.2s ease;

  &:hover {
    background: #3a3a4d;
    color: #ffffff;
    transform: rotate(90deg);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  margin: 0.5rem 0 1.25rem;
  border-radius: 8px;
  border: 1px solid #2d2d3a;
  background: #252535;
  color: #e0e0e8;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);

  &::placeholder {
    color: #6a6a7a;
  }

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    outline: none;
    background: #2a2a3a;
  }
`;

const SubmitButton = styled.button`
  background-color: #6366f1;
  color: white;
  padding: 0.9rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background-color: #3a3a5d;
    cursor: not-allowed;
    transform: none;
  }
`;

const Title = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: #f0f0f5;
  font-weight: 600;
  text-align: center;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #c0c0d0;
  margin-bottom: 0.5rem;
  display: block;
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const EditarUsuarios = ({ usuario, fechar, atualizarLista }) => {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAtualizar = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { nome, email };

    axios.put(`http://localhost:8000/usuarios/${usuario.id}`, payload)
      .then(() => {
        atualizarLista();
        fechar();
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
      });
  };

  return (
    <ModalOverlay onClick={fechar}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={fechar}>
          <X size={20} />
        </CloseButton>
        <Title>Editar Usuário</Title>
        <form onSubmit={handleAtualizar}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Digite o nome completo"
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemplo@email.com"
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditarUsuarios;
