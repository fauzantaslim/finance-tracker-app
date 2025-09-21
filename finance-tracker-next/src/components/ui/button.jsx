import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-extrabold border-2 border-black transition-transform duration-150 ease-out shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "bg-yellow-600 text-white hover:bg-yellow-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "bg-white text-black hover:bg-gray-100",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        ghost: "bg-transparent text-black hover:bg-gray-100 border-transparent",
        link: "bg-transparent text-blue-600 underline-offset-4 hover:underline border-transparent shadow-none hover:translate-x-0 hover:translate-y-0",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-4",
        sm: "h-10 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
