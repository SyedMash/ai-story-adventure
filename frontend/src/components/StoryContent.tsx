"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface StoryContentProps {
  content: string;
  optionA: string | null;
  optionB: string | null;
}

const StoryContent = ({ content, optionA, optionB }: StoryContentProps) => {
  const [storyContent, setStoryContent] = useState(content);
  const [selectOption, setSelectOption] = useState<string | null>(null);
  const [optA, setOptA] = useState<string | null>(optionA);
  const [optB, setOptB] = useState<string | null>(optionB);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectOption) return;
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/continue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          choice: selectOption,
        }),
      });
      if (!response.ok) throw new Error("something went wrong");
      const data = (await response.json()) as ReturnedData;
      setStoryContent(data.intro_story);
      setOptA(data.option_a);
      setOptB(data.option_b);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 rounded-lg border p-4">
      <div className="rounded-md border p-4">
        <p className="text-balance">{storyContent}</p>
      </div>
      <h2 className="my-8 text-xl font-semibold">What Would You Do?</h2>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setSelectOption("A")}
          size={"lg"}
          variant={"outline"}
          className="cursor-pointer"
        >
          {optA}
        </Button>
        <Button
          onClick={() => setSelectOption("B")}
          size={"lg"}
          className="cursor-pointer"
          variant={"outline"}
        >
          {optB}
        </Button>
      </div>
      <Button size={"lg"} onClick={handleNext}>
        {loading ? <Loader2 className="animate-spin" /> : "Next"}
      </Button>
    </div>
  );
};

export default StoryContent;
