import React from "react";
import Chat from "./components/Chat";

export default function App() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const timeStr = time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-200 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">Assistente Virtual</h1>
        <div className="text-gray-600 text-sm">{dateStr} — {timeStr}</div>
      </header>
      <main className="flex-1">
        <Chat />
      </main>
    </div>
  );
}
