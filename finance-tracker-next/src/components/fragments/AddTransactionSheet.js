"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { TextField } from "../ui/textfield";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function AddTransactionSheet({
  open,
  onClose,
  variant = "right",
}) {
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side={variant} 
        className="overflow-y-auto p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white"
      >
        {variant === "bottom" && (
          <div className="w-12 h-1.5 bg-black rounded-full mx-auto mb-4" />
        )}
        <Header onClose={onClose} />
        <Form />
      </SheetContent>
    </Sheet>
  );
}

function Header({ onClose }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-extrabold">Add Transaction</h3>
      <button
        className="text-2xl text-gray-600 hover:text-black transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

function Form() {
  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      {/* type */}
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none transition-transform duration-150"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* amount */}
      <TextField label="Amount" type="number" name="amount" placeholder="0" />

      {/* description */}
      <TextField
        label="Description"
        type="text"
        name="description"
        placeholder="Optional"
      />

      {/* transaction_date */}
      <TextField label="Transaction Date" type="date" name="transaction_date" />

      {/* category_id */}
      <div>
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none transition-transform duration-150"
        >
          <option value="">Select category</option>
        </select>
      </div>

      {/* account_id */}
      <div>
        <Label htmlFor="account_id">Account</Label>
        <select
          id="account_id"
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none transition-transform duration-150"
        >
          <option value="">Select account</option>
        </select>
      </div>

      <div className="pt-2">
        <Button 
          variant="default" 
          type="submit" 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform duration-150"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
