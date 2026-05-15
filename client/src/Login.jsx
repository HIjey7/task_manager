import { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      onLogin(res.data.token, res.data.username);
    } catch (err) {
      console.log(err);
      alert("Ошибка входа");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative overflow-hidden">
      {/* background (blur НЕ анимируем вообще) */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl" />
      </div>

      {/* card */}
      <div className="relative w-80 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-loginIn">
        <h2 className="text-white mb-6 text-xl text-center font-semibold">
          Вход
        </h2>

        <input
          className="w-full mb-3 p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          className="w-full mb-4 p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600/80 hover:bg-indigo-500 transition p-2 rounded text-white shadow-lg"
        >
          Войти
        </button>

        <style>{`
          @keyframes loginIn {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-loginIn {
            animation: loginIn 800ms cubic-bezier(0.22, 1, 0.36, 1);
          }
        `}</style>
      </div>
    </div>
  );
}
