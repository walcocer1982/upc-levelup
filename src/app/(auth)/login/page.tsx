import AuthButton from "@/views/components/login/AuthButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded shadow flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Inicia sesión</h1>
        <p className="mb-2 text-center">Por favor, inicia sesión con tu cuenta de Google para continuar.</p>
        <div className="mt-4">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}