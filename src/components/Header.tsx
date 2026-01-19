"use client";

import { BiHome, BiLogOut, BiTrendingUp, BiBarChartAlt2 } from "react-icons/bi";
import Button from "./Button";
import { logoutUser } from "@/services/auth";
import { useAuthUser } from "@/hooks/useAuthUser";
import Logo from "./Logo";
import { useNavigate, useLocation, Link } from 'react-router-dom';

export function Header() {
  const user = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname

  const hide = pathname.startsWith("/login") || pathname.startsWith("/cadastro");

  if (hide) return null;

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }

  const tabs = [
    { key: "Inicio", label: "Início", icon: BiHome, href: "/dashboard" },
    {
      key: "Transacoes",
      label: "Transações",
      icon: BiTrendingUp,
      href: "/dashboard/transacoes",
    },
    {
      key: "Analises",
      label: "Análises",
      icon: BiBarChartAlt2,
      href: "/dashboard/analises",
    },
  ];
  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.key || "inicio";

  return (
    <header className="flex max-sm:flex-row items-center justify-between md:px-16 max-sm:px-4 py-8 w-full">
      <div className="flex justify-between items-center ">
        <Logo showText={!user} />

        {user && (
          <nav className="flex border-b border-gray-200 ml-8 max-sm:ml-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  className={`
                  relative flex items-center gap-1 max-sm:px-2 px-4 py-2 -mb-px font-medium transition-colors max-sm:text-xs
                  ${isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                    }
                `}
                  onClick={() => navigate(tab.href)}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {user ? (
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="max-sm:text-xs"
        >
          <BiLogOut />
          Sair
        </Button>
      ) : (
        <div className="flex items-center gap-4 max-sm:gap-2">
          <Link to="/login">
            <Button variant="secondary">Entrar</Button>
          </Link>

          <Link to="/cadastro">
            <Button>Criar Conta</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
