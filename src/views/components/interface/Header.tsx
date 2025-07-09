"use client";
import AuthButton from "@/views/components/login/AuthButton";

export default function Cabecera() {
  return (
    <header className="w-full flex justify-end items-center p-4 bg-white shadow">
      <AuthButton />
    </header>
  );
}