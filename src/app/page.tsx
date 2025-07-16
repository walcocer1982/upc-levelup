"use client";
import AuthButton from "@/views/components/login/AuthButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">Bienvenido a StartUp UPC</h1>
        <p className="mb-2 text-lg text-center">¡Bienvenid@!</p>
        <p className="mb-2 text-center">¡Queremos conocer tu emprendimiento!</p>
        <p className="mb-6 text-center">
          Para empezar crea tu cuenta con tu correo gmail
        </p>
        <AuthButton />
      </div>
    </div>
  );
}