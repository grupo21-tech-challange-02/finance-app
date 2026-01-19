import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './main.layout';
import Inicio from '@/app/Inicio/page';
import Transacoes from '@/app/Transacoes/page';
import Analises from '@/app/Analises/page';
import Providers from '@/app/providers';
import Home from '@/app/page';
import { PrivateRoute } from '@/components/private-route';
import LoginPage from '@/app/Login/page';
import CadastroPage from '@/app/Cadastro/page';

export default function RootRoutes(props) {
  return (
    <Providers>

      <BrowserRouter basename="/">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />

            <Route path="/" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Inicio />} />
              <Route path="/dashboard/transacoes" element={<Transacoes />} />
              <Route path="/dashboard/analises" element={<Analises />} />
            </Route>



            {/* Rota 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </Providers>
  );
}

// export default Root;