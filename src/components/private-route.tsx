import { Navigate, Outlet } from 'react-router-dom';
import { useAuthUser } from '@/hooks/useAuthUser';

export function PrivateRoute() {
  const user = useAuthUser();

  // Enquanto verifica autenticação, pode mostrar loading
  if (user === undefined) {
    return <div>Carregando...</div>;
  }

  // Se não autenticado, redireciona para home/login
  if (user === null) {
    return <Navigate to="/" replace />;
  }

  // Se autenticado, renderiza as rotas filhas
  return <Outlet />;
}