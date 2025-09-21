import { useEffect, useRef, useState } from "react";
import Button from "../Elements/Button";
import TextField from "../Elements/Input";
import { useNavigate } from "react-router-dom";
import authLogin from "../../services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { setAccessToken } from "../../redux/slices/authSlice";

export default function FormLogin() {
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loading);

  function handleLogin(e) {
    e.preventDefault();

    // Throttling: jika sudah dalam proses loading, jangan proses lagi
    if (isLoading) return;

    const form = e.currentTarget;
    const email = form.elements.namedItem("email")?.value;
    const password = form.elements.namedItem("password")?.value;

    const data = { email, password };

    if (data.email === "" || data.password === "") {
      return setLoginFailed("email atau password tidak boleh kosong");
    }

    dispatch(setLoading(true));

    authLogin(data, (status, res) => {
      dispatch(setLoading(false));
      if (status) {
        const success = res;
        dispatch(setAccessToken(success.data.data.tokens.access_token));
        navigate("/dashboard");
      } else {
        const err = res;
        const data = err.response?.data;
        let message = "Login gagal";
        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object" && data !== null) {
          const errorData = data;
          if (typeof errorData.errors === "string") {
            message = errorData.errors;
          } else if (Array.isArray(errorData.errors)) {
            message = errorData.errors.map((e) => e.message).join(", ");
          }
        }
        setLoginFailed(message);
      }
    });
  }

  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  return (
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
        variant={"bg-yellow-600 text-white"}
        type={"submit"}
        disabled={isLoading}
        fullWidth={true}
      >
        {isLoading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
}
