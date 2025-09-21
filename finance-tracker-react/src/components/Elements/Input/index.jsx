import Label from "./Label";
import Input from "./Input";
import { forwardRef, useId } from "react";

const TextField = forwardRef(
  ({ label, type, name = "input", placeholder }, ref) => {
    const inputId = useId();
    return (
      <div className="mb-4">
        <Label htmlFor={`${inputId}-${name}`}>{label}</Label>
        <Input
          placeholder={placeholder}
          id={`${inputId}-${name}`}
          name={name}
          type={type}
          ref={ref}
        />
      </div>
    );
  }
);

export default TextField;
