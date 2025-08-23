import React from "react";
import Bounded from "~/components/Bounded";
import StoryContent from "~/components/StoryContent";
import { db } from "~/server/db";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

const StoryPage = async ({ params }: StoryPageProps) => {
  const { id } = await params;

  const storyStep = await db.storyStep.findFirst({
    where: {
      storyId: id,
    },
    include: {
      story: {
        select: {
          name: true,
          country: true,
        },
      },
    },
  });

  if (!storyStep) return null;

  return (
    <Bounded className="h-screen">
      <h1 className="text-2xl font-bold lg:text-3xl xl:text-4xl 2xl:text-6xl">
        {storyStep.story.name},{" "}
        <span className="text-muted-foreground text-base lg:text-xl">
          {storyStep.story.country}
        </span>
      </h1>

      <div className="mt-12">
        <StoryContent
          content={storyStep.content}
          optionA={storyStep.optionA}
          optionB={storyStep.optionB}
        />
      </div>
    </Bounded>
  );
};

export default StoryPage;
