import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";
import { Button } from "~/components/ui/button";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/sign-in");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <p className="">just a home page</p>
      <p>Hello, {session.user.name}</p>
      <Button>Click Me</Button>
    </main>
  );
}
