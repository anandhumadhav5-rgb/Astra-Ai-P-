function LogoMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-content-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-lg shadow-brand-900/40">
        <span className="text-sm font-semibold text-white">N</span>
      </div>
      {!compact ? (
        <div>
          <p className="text-sm font-semibold text-slate-100">NovaChat</p>
          <p className="text-xs text-slate-400">AI Workspace</p>
        </div>
      ) : null}
    </div>
  );
}

export default LogoMark;
