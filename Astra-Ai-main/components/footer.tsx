import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <div className="container flex flex-col gap-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-white">
          <BrainCircuit className="size-5 text-plasma-cyan" aria-hidden />
          <span className="font-display font-semibold">ASTRA AI</span>
        </div>
        <p>Autonomous intelligence infrastructure for high-velocity teams.</p>
      </div>
    </footer>
  );
}
