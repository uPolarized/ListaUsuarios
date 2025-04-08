import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageWrapper = styled.div`
  height: 100vh;
  background: linear-gradient(to right, #1e1e2d, #2a2a3d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const SupportBox = styled.div`
  background: #1e1e2d;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 460px;
  text-align: center;
  border: 1px solid #2d2d3a;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #f3f4f6;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #c5c5d1;
  margin-bottom: 2rem;
`;

const ContactButton = styled.a`
  display: inline-block;
  background-color: #6366f1;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4f46e5;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  color: #a5b4fc;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Suporte = () => {
  return (
    <PageWrapper>
      <SupportBox>
        <Title>Precisa de ajuda?</Title>
        <Text>Nosso suporte está disponível para te ajudar com qualquer dúvida.</Text>
        <ContactButton href="mailto:jvsbjullian@hotmail.com">Entrar em contato</ContactButton>
        <br />
        <BackLink to="/login">← Voltar ao login</BackLink>
      </SupportBox>
    </PageWrapper>
  );
};

export default Suporte;
