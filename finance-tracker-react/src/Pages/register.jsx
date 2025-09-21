import Formregister from "../components/Fragments/FormRegister";
import AuthLayout from "../components/Layouts/AuthLayouts";

export default function RegisterPage() {
  return (
    <AuthLayout titlePage={"Register"} isLoginPage={false}>
      <Formregister />
    </AuthLayout>
  );
}
