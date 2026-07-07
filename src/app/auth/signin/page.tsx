import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/app");

  return (
    <main className="mx-auto max-w-sm px-4 py-24 text-center">
      <h1 className="mb-8 text-3xl font-bold">Sign in to DawnBrief</h1>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData);
        }}
        className="space-y-4"
      >
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-center"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
        >
          Sign in with Email
        </button>
      </form>
    </main>
  );
}
