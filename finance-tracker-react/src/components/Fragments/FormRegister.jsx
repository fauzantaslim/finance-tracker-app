import Button from "../Elements/Button";
import TextField from "../Elements/Input";

export default function Formregister() {
  return (
    <form action="">
      <TextField
        label="Full Name"
        type="text"
        name="fname"
        placeholder="John Doe"
      />
      <TextField
        label="Email"
        type="email"
        name="email"
        placeholder="example@example.com"
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        placeholder="****"
      />
      <TextField
        label="Confirm Password"
        type="password"
        name="cpassword"
        placeholder="****"
      />
      <Button variant={"bg-yellow-600 text-white"} fullWidth={true}>
        register
      </Button>
    </form>
  );
}
