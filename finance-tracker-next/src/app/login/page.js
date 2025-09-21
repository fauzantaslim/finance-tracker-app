"use client";

import AuthLayout from "@/components/layouts/AuthLayouts";
import FormLogin from "@/components/fragments/FormLogin";

export default function LoginPage() {
  return (
    <AuthLayout titlePage="Login" isLoginPage={true}>
      <FormLogin />
    </AuthLayout>
  );
}
