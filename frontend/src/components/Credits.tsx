import React from "react";
import { db } from "~/server/db";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Credits = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/sign-in");

  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      credits: true,
    },
  });
  return <p className="ml-2 font-semibold">{user?.credits}</p>;
};

export default Credits;
