import { redirect } from "next/navigation";
import { signUp } from "@/app/actions";
import { AuthForm } from "@/app/components/AuthForm";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthForm
      title="Create account"
      description="Create an internal booking account. Supabase may ask you to confirm your email."
      action={signUp}
      buttonLabel="Create account"
      alternateHref="/login"
      alternateText="Already have an account? Sign in"
    />
  );
}
