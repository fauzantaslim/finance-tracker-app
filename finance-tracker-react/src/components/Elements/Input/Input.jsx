import { forwardRef } from "react";

const Input = forwardRef(({ type, name, placeholder, id, disabled }, ref) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      className={`w-full mb-2 px-3 py-2 rounded-xl border-2 border-black transition-transform duration-150 ease-out shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed shadow-none" : ""
      }`}
      disabled={disabled}
      ref={ref}
    />
  );
});

export default Input;
