export default function DefaultTab() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6">
      <p className="text-lg font-medium">No open tabs</p>
      <p className="text-sm mt-1">Select a problem from the sidebar or click "+ New Problem" to begin.</p>
    </div>
  );
}