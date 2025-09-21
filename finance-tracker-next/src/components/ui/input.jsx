import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full mb-2 px-3 py-2 rounded-xl border-2 border-black transition-transform duration-150 ease-out shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none bg-white text-black placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
