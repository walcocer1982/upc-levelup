"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/founder" passHref>
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs">
            <User size={16} />
            <span>{session.user?.name}</span>
          </Button>
        </Link>
        <Button
          onClick={async () => {
            await signOut({ redirect: false });
            router.push("/");
          }}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs"
        >
          <LogOut size={16} />
          Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/founder" })}
      className="flex items-center gap-2"
    >
      <User size={16} />
      Iniciar sesión con Google
    </Button>
  );
}