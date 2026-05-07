import { useEffect, useState } from "react";
import api from "./api";
import Login from "./Login";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || "",
  );

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data.filter(Boolean) : []);
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  useEffect(() => {
    const close = () => setOpenMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    setTasks([]);
  };

  const addTask = async () => {
    if (!text.trim()) return;

    const res = await api.post("/tasks", { text });
    if (res.data) setTasks((prev) => [...prev, res.data]);

    setText("");
  };

  const del = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t?._id !== id));
  };

  const bulkDelete = async () => {
    if (!selected.length) return;

    await api.post("/tasks/bulk-delete", { ids: selected });
    setTasks((prev) => prev.filter((t) => !selected.includes(t._id)));
    setSelected([]);
  };

  const toggleSelect = (id) => {
    if (!id) return;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const singleChange = async (id, status) => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    if (!res.data) return;

    setTasks((prev) => prev.map((t) => (t?._id === id ? res.data : t)));
  };

  const bulkChange = async (status) => {
    if (!selected.length) return;

    const res = await api.patch("/tasks/bulk-status", {
      ids: selected,
      status,
    });

    if (!Array.isArray(res.data)) return;

    setTasks((prev) =>
      prev.map((t) => {
        const upd = res.data.find((u) => u?._id === t?._id);
        return upd || t;
      }),
    );

    setSelected([]);
  };

  const saveEdit = async () => {
    if (!editTask?._id) return;

    const res = await api.patch(`/tasks/${editTask._id}/text`, {
      text: editText,
    });

    if (!res.data) return;

    setTasks((prev) =>
      prev.map((t) => (t?._id === editTask._id ? res.data : t)),
    );

    setEditTask(null);
    setEditText("");
  };

  const grouped = {
    none: [],
    todo: [],
    progress: [],
    done: [],
  };

  tasks.filter(Boolean).forEach((t) => {
    const key = t?.status || "none";
    if (grouped[key]) grouped[key].push(t);
  });

  if (!token) {
    return (
      <Login
        onLogin={(t, u) => {
          localStorage.setItem("token", t);
          localStorage.setItem("username", u);
          setToken(t);
          setUsername(u);
        }}
      />
    );
  }

  const TaskCard = ({ task }) => {
    if (!task) return null;

    return (
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg mb-2 relative overflow-visible">
        <div className="flex items-start gap-3 relative">
          <input
            type="checkbox"
            checked={task?._id ? selected.includes(task._id) : false}
            onChange={() => toggleSelect(task?._id)}
            className="w-5 h-5 mt-1 accent-green-500 cursor-pointer flex-shrink-0"
          />

          <span className="flex-1 text-slate-200 break-words whitespace-pre-wrap min-w-0">
            {task?.text}
          </span>

          {/* КНОПКА МЕНЮ */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === task._id ? null : task._id);
              }}
              className="text-slate-400 px-2 flex-shrink-0 cursor-pointer hover:text-white transition"
            >
              ⋮
            </button>

            {/* МЕНЮ */}
            {openMenu === task._id && (
              <div className="absolute right-0 top-8 z-50 bg-slate-800 border border-slate-700 rounded w-48 shadow-xl">
                <button
                  onClick={() => {
                    singleChange(task._id, "todo");
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-500/30 cursor-pointer"
                >
                  К выполнению
                </button>

                <button
                  onClick={() => {
                    singleChange(task._id, "progress");
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-500/30 cursor-pointer"
                >
                  В работе
                </button>

                <button
                  onClick={() => {
                    singleChange(task._id, "done");
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-500/30 cursor-pointer"
                >
                  Готово
                </button>

                <button
                  onClick={() => {
                    setEditTask(task);
                    setEditText(task.text || "");
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-yellow-500/30 cursor-pointer"
                >
                  Редактировать
                </button>

                <button
                  onClick={() => {
                    del(task._id);
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-red-300 hover:bg-red-500/30 cursor-pointer"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Управление задачами</h1>

        <div className="flex gap-3 items-center">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
            {username?.[0]?.toUpperCase()}
          </div>

          <span className="text-slate-300">{username}</span>

          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded cursor-pointer hover:bg-red-500 transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* INPUT */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Новая задача..."
          className="flex-1 p-2 rounded bg-slate-800"
        />

        <button
          onClick={addTask}
          className="bg-blue-600 px-5 py-2 rounded w-full sm:w-auto cursor-pointer hover:bg-blue-500 transition"
        >
          Добавить
        </button>
      </div>

      {/* BULK */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => bulkChange("todo")}
          className="bg-blue-700 px-3 py-1 rounded cursor-pointer"
        >
          К выполнению
        </button>

        <button
          onClick={() => bulkChange("progress")}
          className="bg-yellow-700 px-3 py-1 rounded cursor-pointer"
        >
          В работе
        </button>

        <button
          onClick={() => bulkChange("done")}
          className="bg-green-700 px-3 py-1 rounded cursor-pointer"
        >
          Готово
        </button>

        <button
          onClick={bulkDelete}
          className="bg-red-700 px-3 py-1 rounded cursor-pointer"
        >
          Удалить выбранные
        </button>
      </div>

      {/* COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(grouped).map(([key, list]) => (
          <div key={key} className="bg-slate-900/50 p-3 rounded-lg">
            <h2 className="mb-2 text-center font-semibold">
              {key === "none" && "Задачи"}
              {key === "todo" && "К выполнению"}
              {key === "progress" && "В работе"}
              {key === "done" && "Готово"}
            </h2>

            {list.filter(Boolean).map((t) => (
              <TaskCard key={t._id} task={t} />
            ))}
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-900 p-4 rounded w-80">
            <h2 className="mb-3">Редактирование</h2>

            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 bg-slate-800 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTask(null)}
                className="px-3 py-1 bg-gray-600 rounded cursor-pointer"
              >
                Отмена
              </button>

              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-green-600 rounded cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
