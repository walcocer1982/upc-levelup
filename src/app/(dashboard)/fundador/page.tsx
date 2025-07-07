"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cabecera from "@/views/components/ui/Header";

export default function FundadorPage() {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Cargando...</div>;

  return (
    <>
      <Cabecera />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Bienvenido, {data?.user?.name || "Fundador"}
        </h1>
        <p>¡Has iniciado sesión correctamente!</p>
      </div>
    </>
  );
}