"use client";

import AuthLayout from "@/components/layouts/AuthLayouts";
import FormRegister from "@/components/fragments/FormRegister";

export default function RegisterPage() {
  return (
    <AuthLayout titlePage="Register" isLoginPage={false}>
      <FormRegister />
    </AuthLayout>
  );
}
