export default function Button({
  variant,
  children,
  onClick = () => {},
  type = "button",
  disabled = false,
  fullWidth = false,
  size = "md",
}) {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : size === "lg"
      ? "px-8 py-4 text-lg"
      : "px-6 py-3 text-base";

  const base =
    "inline-block rounded-xl font-extrabold border-2 border-black transition-transform duration-150 ease-out";
  const neo =
    "shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none"
    : "";

  return (
    <button
      className={`${base} ${sizeClasses} ${neo} ${variant} ${disabledStyles} ${
        fullWidth ? "w-full" : ""
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
