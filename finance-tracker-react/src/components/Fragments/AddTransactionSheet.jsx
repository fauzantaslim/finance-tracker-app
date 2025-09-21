import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import Button from "../Elements/Button";
import TextField from "../Elements/Input";
import Label from "../Elements/Input/Label";

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
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Sheet */}
          {variant === "right" ? (
            <Motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              className="relative ml-auto h-full w-full max-w-md bg-white border-l-2 border-black shadow-[-4px_0_0_0_rgba(0,0,0,1)] p-4 overflow-y-auto"
            >
              <Header onClose={onClose} />
              <Form />
            </Motion.div>
          ) : (
            <Motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              className="relative mt-auto w-full bg-white border-t-2 border-black shadow-[0_-4px_0_0_rgba(0,0,0,1)] p-4 rounded-t-2xl overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-black rounded-full mx-auto mb-4" />
              <Header onClose={onClose} />
              <Form />
            </Motion.div>
          )}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ onClose }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-extrabold">Add Transaction</h3>
      <button
        className="text-2xl text-gray-600 hover:text-black"
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
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white"
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
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white"
        >
          <option value="">Select category</option>
        </select>
      </div>

      {/* account_id */}
      <div>
        <Label htmlFor="account_id">Account</Label>
        <select
          id="account_id"
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white"
        >
          <option value="">Select account</option>
        </select>
      </div>

      <div className="pt-2">
        <Button variant="bg-yellow-400" type="submit" fullWidth>
          Save
        </Button>
      </div>
    </form>
  );
}
