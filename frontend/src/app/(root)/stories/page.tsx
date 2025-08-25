import React from "react";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import Bounded from "~/components/Bounded";
import StoriesCard from "~/components/StoriesCard";

const StoriesPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/sign-in");

  const stories = await db.story.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          credits: true,
        },
      },
    },
  });

  return (
    <Bounded className="h-screen">
      <h1 className="text-2xl font-bold capitalize lg:text-3xl">
        Your Stories
      </h1>
      <p className="text-muted-foreground mb-12">
        All the stories you have created so far
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stories.map((story) => (
          <StoriesCard key={story.id} {...story} />
        ))}
      </div>
    </Bounded>
  );
};

export default StoriesPage;
