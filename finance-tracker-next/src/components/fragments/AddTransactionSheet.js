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
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side={variant} className="overflow-y-auto">
        {variant === "bottom" && (
          <div className="w-12 h-1.5 bg-black rounded-full mx-auto mb-4" />
        )}
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
        </SheetHeader>
        <Form />
      </SheetContent>
    </Sheet>
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
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none"
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
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none"
        >
          <option value="">Select category</option>
        </select>
      </div>

      {/* account_id */}
      <div>
        <Label htmlFor="account_id">Account</Label>
        <select
          id="account_id"
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none"
        >
          <option value="">Select account</option>
        </select>
      </div>

      <div className="pt-2">
        <Button variant="default" type="submit" className="w-full">
          Save
        </Button>
      </div>
    </form>
  );
}
