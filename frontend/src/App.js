// App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Tire o BrowserRouter daqui
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import ListaUsuarios from './components/ListaUsuarios';
import LoginPage from './components/Login';
import Suporte from './components/Suporte';
import GerarPDF from './pages/GerarPDF';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

function App() {
  const [temaEscuro, setTemaEscuro] = useState(true);

  return (
    <ThemeProvider theme={temaEscuro ? darkTheme : lightTheme}>
      <GlobalStyle />
      {/* REMOVER O <Router> DAQUI */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/usuarios"
          element={
            <ListaUsuarios
              alternarTema={() => setTemaEscuro(!temaEscuro)}
              temaAtual={temaEscuro}
            />
          }
        />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/gerar-pdf" element={<GerarPDF />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
