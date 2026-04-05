export const Button = ({ children, onClick, variant = 'primary', disabled }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50"
  };
  return <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]}`}>{children}</button>;
};