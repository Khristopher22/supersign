"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();


  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleLogin() {
    if (!email || !password) {
      toast.info("Preencha todos os campos!");
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
      });

      if (result?.error === "UserNotFound") {
        toast.error("Usuário não encontrado.");
      } else if (result?.error === "NoPassword") {
        toast.error("Este e-mail foi cadastrado via Google. Use o botão 'Entrar com Google'.");
      } else if (result?.error) {
        toast.error("E-mail ou senha inválidos.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Erro no signIn:", err);
      toast.error("");
    }
  }

  async function handleRegister() {
    if (password !== confirmPassword) {
      toast.warning("As senhas não coincidem!");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: "Usuário" }),
    });

    if (res.ok) {
      toast.success("Cadastro realizado! Agora faça login.");
      setIsRegistering(false);
    } else {
      const { error } = await res.json();
      toast.error(error || "Erro ao cadastrar.");
    }
  }

  // Mostrar loading enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isRegistering ? "Criar Conta" : "Entrar"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />

        {isRegistering && (
          <input
            type="password"
            placeholder="Confirme a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        )}

        {isRegistering ? (
          <button
            onClick={handleRegister}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Criar Conta
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Entrar
          </button>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-md flex justify-center items-center hover:bg-red-600 transition"
        >
          <FaGoogle className="mr-2" /> Entrar com Google
        </button>

        <p className="text-center text-gray-600">
          {isRegistering ? (
            <>Já tem uma conta?{" "}
              <span
                onClick={() => setIsRegistering(false)}
                className="text-indigo-600 cursor-pointer hover:underline"
              >
                Faça login
              </span>
            </>
          ) : (
            <>Não tem uma conta?{" "}
              <span
                onClick={() => setIsRegistering(true)}
                className="text-indigo-600 cursor-pointer hover:underline"
              >
                Crie uma conta
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}