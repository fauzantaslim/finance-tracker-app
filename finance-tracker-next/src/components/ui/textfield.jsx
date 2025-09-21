"use client";

import { forwardRef, useId } from "react";
import { Label } from "./label";
import { Input } from "./input";

const TextField = forwardRef(
  ({ label, type, name = "input", placeholder, className, ...props }, ref) => {
    const inputId = useId();
    return (
      <div className={`mb-4 ${className || ""}`}>
        <Label htmlFor={`${inputId}-${name}`}>{label}</Label>
        <Input
          placeholder={placeholder}
          id={`${inputId}-${name}`}
          name={name}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TextField.displayName = "TextField";

export { TextField };
