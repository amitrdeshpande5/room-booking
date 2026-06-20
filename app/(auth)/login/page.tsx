import { redirect } from "next/navigation";
import { signIn } from "@/app/actions";
import { AuthForm } from "@/app/components/AuthForm";
import { SetupNotice } from "@/app/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthForm
      title="Sign in"
      description="Use your company email and password to manage meeting room bookings."
      action={signIn}
      buttonLabel="Sign in"
      alternateHref="/signup"
      alternateText="Need an account? Sign up"
    />
  );
}
