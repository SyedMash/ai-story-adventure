"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export const saveStoryToDatabase = async (
  data: StoryData,
  returnedData: ReturnedData,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  const { user } = session;

  try {
    const { id } = await db.story.create({
      data: {
        country: data.country,
        city: data.city,
        companion: data.companion,
        budget: data.budget,
        duration: data.duration,
        relationShipDynamics: data.relationShipDynamics,
        adventuresStyle: data.adventuresStyle,
        tone: data.tone,
        conflict: data.conflict,
        userId: user.id,
        name: data.city,
      },
    });

    await db.storyStep.create({
      data: {
        storyId: id,
        content: returnedData.intro_story,
        optionA: returnedData.option_a,
        optionB: returnedData.option_b,
        stepOrder: 0,
      },
    });

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        credits: {
          decrement: 10,
        },
      },
    });

    redirect(`/stories/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const updateStoryEnd = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/sign-in");

  await db.storyStep.update({
    where: {
      id: id,
    },
    data: {
      isEnd: true,
    },
  });
};
