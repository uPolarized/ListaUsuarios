import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { FaFilePdf } from 'react-icons/fa';

const Container = styled.div`
  max-width: 700px;
  margin: 5rem auto;
  padding: 3rem 2rem;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.3s ease-in-out;

  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
    margin: 2rem 1rem;
  }
`;

const Titulo = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.primary};
`;

const Botao = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #e63946, #d62828);
  color: #fff;
  border: none;
  padding: 0.9rem 1.8rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(230, 57, 70, 0.4);
  }
`;

const GerarPDF = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Erro ao buscar usuários:', err));
  }, []);

  const gerarPDF = () => {
    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    doc.setFontSize(18);
    doc.text('Relatório de Usuários', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Data: ${dataAtual}`, 105, 28, { align: 'center' });

    const administradores = usuarios.filter(u =>
      ['joaovictor@gmail.com', 'Fabricio@gmail.com'].includes(u.email)
    );
    const comuns = usuarios.filter(u =>
      !['joaovictor@gmail.com', 'Fabricio@gmail.com'].includes(u.email)
    );

    const gerarTabela = (titulo, lista, startY) => {
      if (lista.length === 0) return startY;

      doc.setFontSize(13);
      doc.text(titulo, 105, startY, { align: 'center' });

      autoTable(doc, {
        startY: startY + 4,
        head: [['ID', 'Nome', 'Email']],
        body: lista.map(u => [u.id, u.nome, u.email]),
        margin: { left: 14, right: 14 },
      });

      return doc.lastAutoTable.finalY + 10;
    };

    let y = 40;
    y = gerarTabela('Administradores', administradores, y);
    gerarTabela('Usuários Comuns', comuns, y);

    doc.save('usuarios.pdf');
  };

  return (
    <Container>
      <Titulo>Gerar PDF da Lista de Usuários</Titulo>
      <Botao onClick={gerarPDF}>
        <FaFilePdf size={20} />
        Baixar PDF
      </Botao>
    </Container>
  );
};

export default GerarPDF;
