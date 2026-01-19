"use client";

import { useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useLocation, useNavigate, } from "react-router-dom";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const user = useAuthUser();

  const { pathname } = location

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate(`/Login?next=${encodeURIComponent(pathname)}`, { replace: true });
    }
  }, [user, navigate, pathname]);

  if (user === undefined) {
    return <div>Carregando…</div>;
  }
  if (user === null) {
    return null;
  }

  return <>{children}</>;
}
