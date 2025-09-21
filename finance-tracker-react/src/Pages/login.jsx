import FormLogin from "../components/Fragments/FormLogin";
import AuthLayout from "../components/Layouts/AuthLayouts";

export default function LoginPage() {
  return (
    <AuthLayout titlePage={"Login"} isLoginPage={true}>
      <FormLogin />
    </AuthLayout>
  );
}
