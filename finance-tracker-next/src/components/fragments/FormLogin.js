"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { TextField } from "../ui/textfield";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setAccessToken, setUser } from "@/redux/slices/authSlice";
import authService from "@/services/auth.service";
import ClientOnly from "../ui/ClientOnly";

export default function FormLogin() {
  const router = useRouter();
  const [loginFailed, setLoginFailed] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loading);

  async function handleLogin(e) {
    e.preventDefault();

    // Throttling: if already loading, don't process again
    if (isLoading) return;

    const form = e.currentTarget;
    const email = form.elements.namedItem("email")?.value;
    const password = form.elements.namedItem("password")?.value;

    const data = { email, password };

    if (data.email === "" || data.password === "") {
      return setLoginFailed("Email or password cannot be empty");
    }

    dispatch(setLoading(true));

    try {
      const response = await authService.login(email, password);

      if (response.success) {
        const { access_token } = response.data.tokens;
        const user = response.data.user;

        // Store token and user data in Redux
        dispatch(setAccessToken(access_token));
        dispatch(setUser(user));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setLoginFailed("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);

      let message = "Login failed";

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

      setLoginFailed(message);
    } finally {
      dispatch(setLoading(false));
    }
  }

  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  return (
    <ClientOnly
      fallback={
        <form className="space-y-2">
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
            placeholder="****"
          />
          <Button variant="default" type="submit" className="w-full">
            Login
          </Button>
        </form>
      }
    >
      <form onSubmit={handleLogin} className="space-y-2">
        {loginFailed && (
          <p className="bg-rose-500 text-white border-2 border-black rounded-xl px-3 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {loginFailed}
          </p>
        )}
        <TextField
          ref={usernameRef}
          label="Email"
          type="email"
          name="email"
          placeholder="john.doe@example.com"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          placeholder="****"
        />
        <Button
          variant="default"
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </ClientOnly>
  );
}
