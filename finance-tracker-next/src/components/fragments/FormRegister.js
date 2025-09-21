"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { TextField } from "../ui/textfield";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/loadingSlice";
import authService from "@/services/auth.service";
import ClientOnly from "../ui/ClientOnly";

export default function FormRegister() {
  const router = useRouter();
  const [registerFailed, setRegisterFailed] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loading);

  async function handleRegister(e) {
    e.preventDefault();

    // Throttling: if already loading, don't process again
    if (isLoading) return;

    const form = e.currentTarget;
    const email = form.elements.namedItem("email")?.value;
    const full_name = form.elements.namedItem("full_name")?.value;
    const password = form.elements.namedItem("password")?.value;
    const confirmPassword = form.elements.namedItem("confirmPassword")?.value;

    // Client-side validation
    if (!email || !full_name || !password || !confirmPassword) {
      return setRegisterFailed("All fields are required");
    }

    if (password !== confirmPassword) {
      return setRegisterFailed("Passwords do not match");
    }

    if (password.length < 8) {
      return setRegisterFailed("Password must be at least 8 characters");
    }

    const userData = { email, full_name, password };

    dispatch(setLoading(true));

    try {
      const response = await authService.register(userData);

      if (response.success) {
        // Registration successful, redirect to login
        router.push("/login");
      } else {
        setRegisterFailed("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);

      let message = "Registration failed";

      if (error.response) {
        const { data } = error.response;

        if (typeof data.errors === "string") {
          message = data.errors;
        } else if (Array.isArray(data.errors)) {
          message = data.errors.map((e) => e.message).join(", ");
        } else if (data.message) {
          message = data.message;
        }
      }

      setRegisterFailed(message);
    } finally {
      dispatch(setLoading(false));
    }
  }

  const fullNameRef = useRef(null);

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  return (
    <ClientOnly
      fallback={
        <form className="space-y-2">
          <TextField
            label="Full Name"
            type="text"
            name="full_name"
            placeholder="John Doe"
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            placeholder="john.doe@example.com"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="********"
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="********"
          />
          <Button variant="default" type="submit" className="w-full">
            Register
          </Button>
        </form>
      }
    >
      <form onSubmit={handleRegister} className="space-y-2">
        {registerFailed && (
          <p className="bg-rose-500 text-white border-2 border-black rounded-xl px-3 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {registerFailed}
          </p>
        )}
        <TextField
          ref={fullNameRef}
          label="Full Name"
          type="text"
          name="full_name"
          placeholder="John Doe"
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          placeholder="john.doe@example.com"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          placeholder="********"
        />
        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="********"
        />
        <Button
          variant="default"
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </ClientOnly>
  );
}
