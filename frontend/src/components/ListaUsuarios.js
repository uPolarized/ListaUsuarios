import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { User, X, Pencil, Trash2, Moon, Sun, LogOut, FileText } from 'lucide-react';
import axios from 'axios';
import EditarUsuarios from './EditarUsuarios';
import { ToastContainer, toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  font-family: 'Segoe UI', sans-serif;
  color: ${({ theme }) => theme.text};
`;

const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Titulo = styled.h1`
  font-size: 2.2rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-align: center;
  flex: 1;

  &:hover {
    filter: brightness(1.2);
    transform: scale(1.02);
  }

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const BotaoIcone = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  transition: 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const BotaoLogout = styled.button`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 50%;
  padding: 0.6rem;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const Topo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const InputBusca = styled.input`
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  flex: 1;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const SelectOrdenar = styled.select`
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const BotoesTopo = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const BotaoCadastrar = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const BotaoPDF = styled.button`
  padding: 0.6rem 1rem;
  background-color: ${({ theme }) => theme.secondary || '#10b981'};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.secondaryHover || '#059669'};
  }
`;

const Lista = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UsuarioCard = styled.div`
  background-color: ${({ theme }) => theme.inputBg};
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  flex-wrap: wrap;
  gap: 1rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Nome = styled.p`
  font-weight: bold;
  margin: 0;
`;

const Email = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.mutedText};
  word-break: break-word;
`;

const BotoesAcoes = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 2rem;
  border-radius: 16px;
  width: 400px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin: 0.5rem 0 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.7rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const ListaUsuarios = ({ alternarTema, temaAtual }) => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ordem, setOrdem] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [textoBusca, setTextoBusca] = useState('');

  const buscarUsuarios = () => {
    axios.get('http://localhost:8000/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setNome('');
    setEmail('');
    setSenha('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/usuarios', { nome, email, senha })
      .then(() => {
        buscarUsuarios();
        fecharModal();
        toast.success("Usuário cadastrado com sucesso!");
      })
      .catch(err => {
        if (err.response?.status === 400 && err.response.data.detail === 'Email já cadastrado') {
          toast.error("Erro: Este email já está cadastrado!");
        } else {
          toast.error("Erro ao cadastrar usuário");
        }
      });
  };

  const confirmarRemocao = (id) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      axios.delete(`http://localhost:8000/usuarios/${id}`)
        .then(() => {
          buscarUsuarios();
          toast.success("Usuário removido com sucesso!");
        })
        .catch(() => toast.error("Erro ao remover usuário"));
    }
  };

  const debouncedFiltro = debounce((valor) => setFiltro(valor), 300);

  const handleBuscaChange = (e) => {
    const valor = e.target.value;
    setTextoBusca(valor);
    debouncedFiltro(valor);
  };

  const usuariosFiltrados = usuarios
    .filter(u =>
      u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      if (!ordem) return 0;
      const campoA = a[ordem].toLowerCase();
      const campoB = b[ordem].toLowerCase();
      return campoA.localeCompare(campoB);
    });

  const administradores = usuariosFiltrados.filter(u =>
    ['joaovictor@gmail.com', 'Fabricio@gmail.com'].includes(u.email)
  );
  const usuariosComum = usuariosFiltrados.filter(u =>
    !['joaovictor@gmail.com', 'Fabricio@gmail.com'].includes(u.email)
  );

  const irParaGerarPDF = () => {
    navigate('/gerar-pdf');
  };

  return (
    <>
      <Container>
        <ToastContainer position="top-center" />

        <Cabecalho>
          <BotaoIcone onClick={alternarTema}>
            {temaAtual ? <Sun size={22} /> : <Moon size={22} />}
          </BotaoIcone>

          <Titulo>Usuários Cadastrados</Titulo>

          <BotaoLogout onClick={handleLogout} title="Sair">
            <LogOut size={22} />
          </BotaoLogout>
        </Cabecalho>

        <Topo>
          <InputBusca
            type="text"
            placeholder="Buscar por nome ou email..."
            value={textoBusca}
            onChange={handleBuscaChange}
          />
          <SelectOrdenar value={ordem} onChange={(e) => setOrdem(e.target.value)}>
            <option value="">Ordenar por...</option>
            <option value="nome">Nome</option>
          </SelectOrdenar>
          <BotoesTopo>
            <BotaoPDF onClick={irParaGerarPDF}>
              <FileText size={18} /> Gerar PDF
            </BotaoPDF>
            <BotaoCadastrar onClick={abrirModal}>Cadastrar</BotaoCadastrar>
          </BotoesTopo>
        </Topo>
        
        {mostrarModal && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={fecharModal}><X size={20} /></CloseButton>
              <h3>Cadastrar Usuário</h3>
              <form onSubmit={handleSubmit}>
                <label>Nome</label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
                <label>Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Senha</label>
                <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <SubmitButton type="submit">Cadastrar</SubmitButton>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {usuarioEditando && (
          <EditarUsuarios
            usuario={usuarioEditando}
            fechar={() => setUsuarioEditando(null)}
            atualizarLista={buscarUsuarios}
          />
        )}

        {administradores.length > 0 && (
          <section>
            <h2>Administradores</h2>
            <Lista>
              {administradores.map(usuario => (
                <UsuarioCard key={usuario.id}>
                  <Info>
                    <User size={32} color="#6366f1" />
                    <div>
                      <Nome>{usuario.nome}</Nome>
                      <Email>{usuario.email}</Email>
                    </div>
                  </Info>
                  <BotoesAcoes>
                    <BotaoIcone onClick={() => setUsuarioEditando(usuario)}>
                      <Pencil size={20} />
                    </BotaoIcone>
                    <BotaoIcone onClick={() => confirmarRemocao(usuario.id)}>
                      <Trash2 size={20} color="red" />
                    </BotaoIcone>
                  </BotoesAcoes>
                </UsuarioCard>
              ))}
            </Lista>
          </section>
        )}

        {usuariosComum.length > 0 && (
          <section>
            <h2>Usuários Comuns</h2>
            <Lista>
              {usuariosComum.map(usuario => (
                <UsuarioCard key={usuario.id}>
                  <Info>
                    <User size={32} color="#6366f1" />
                    <div>
                      <Nome>{usuario.nome}</Nome>
                      <Email>{usuario.email}</Email>
                    </div>
                  </Info>
                  <BotoesAcoes>
                    <BotaoIcone onClick={() => setUsuarioEditando(usuario)}>
                      <Pencil size={20} />
                    </BotaoIcone>
                    <BotaoIcone onClick={() => confirmarRemocao(usuario.id)}>
                      <Trash2 size={20} color="red" />
                    </BotaoIcone>
                  </BotoesAcoes>
                </UsuarioCard>
              ))}
            </Lista>
          </section>
        )}
      </Container>
    </>
  );
};

export default ListaUsuarios;
