import { useState } from "react";
import api from "./api";

export default function Register({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handle = async () => {
    const res = await axios.post("http://localhost:3000/api/auth/register", {
      email,
      password,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);
    onLogin(token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-80 bg-slate-900 p-6 rounded-xl space-y-3">
        <h1 className="text-xl">Register</h1>

        <input
          className="w-full p-2 bg-slate-800 rounded"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 bg-slate-800 rounded"
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handle} className="w-full bg-green-600 p-2 rounded">
          Создать аккаунт
        </button>
      </div>
    </div>
  );
}
