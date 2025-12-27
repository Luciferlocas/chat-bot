import Widget from "./components/chat/widget";

export default function App() {
  return (
    <div className="min-h-dvh flex items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center text-center font-mono p-4 gap-2">
        <h1 className="text-2xl md:text-5xl font-black">TechNova</h1>
        <p className="text-sm md:text-lg max-w-xl">
          If you have any questions, please feel free to ask the assistant at
          the bottom right of the page.
        </p>
      </div>
      <Widget />
    </div>
  );
}
