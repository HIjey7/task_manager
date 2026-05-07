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

      onLogin(res.data.token, res.data.username);
    } catch (err) {
      console.log(err);
      alert("Ошибка входа");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="bg-slate-900 p-6 rounded w-80">
        <h2 className="text-white mb-4 text-xl">Вход</h2>

        <input
          className="w-full mb-3 p-2 bg-slate-800 rounded text-white"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 bg-slate-800 rounded text-white"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-2 rounded text-white"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
