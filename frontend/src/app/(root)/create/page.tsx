import React from "react";

import Bounded from "~/components/Bounded";
import StoryForm from "~/components/StoryForm";

const CreatePage = () => {
  return (
    <Bounded className="min-h-screen">
      <p className="text-2xl font-bold capitalize lg:text-3xl">
        create an interactive travel story
      </p>
      <p className="text-muted-foreground mb-12">
        Choose accordingly to create a story
      </p>
      <StoryForm />
    </Bounded>
  );
};

export default CreatePage;
