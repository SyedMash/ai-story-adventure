"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader, Loader2 } from "lucide-react";
import clsx from "clsx";
import { updateStoryEnd } from "~/actions/story.action";

interface StoryContentProps {
  content: string;
  optionA: string | null;
  optionB: string | null;
  isEnd: boolean;
  id: string;
  credits: number;
}

const StoryContent = ({
  content,
  optionA,
  optionB,
  isEnd,
  id,
  credits,
}: StoryContentProps) => {
  const [storyContent, setStoryContent] = useState(content);
  const [selectOption, setSelectOption] = useState<string | null>(null);
  const [optA, setOptA] = useState<string | null>(optionA);
  const [optB, setOptB] = useState<string | null>(optionB);
  const [loading, setLoading] = useState(false);
  const [isStoryEnd, setIsStoryEnd] = useState(isEnd);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: { intro_story: content, option_a: optionA!, option_b: optionB! },
    },
  ]);

  const handleNext = async () => {
    if (!selectOption) return;
    try {
      setLoading(true);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "user",
          content: selectOption,
        },
      ]);
      const response = await fetch("http://127.0.0.1:8000/continue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previous_history: chatHistory,
          choice: selectOption,
        }),
      });
      if (!response.ok) throw new Error("something went wrong");
      const data = (await response.json()) as ReturnedData;
      console.log(data);
      setStoryContent(data.intro_story);
      setOptA(data.option_a);
      setOptB(data.option_b);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data,
        },
      ]);
      if (data.is_end) {
        setIsStoryEnd(true);
        await updateStoryEnd(id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSelectOption(null);
    }
  };

  return (
    <div className="space-y-12 rounded-lg border p-4">
      <div className="rounded-md border p-4">
        <p className="text-balance">{storyContent}</p>
      </div>
      {isStoryEnd ? (
        <h1>Story Ended</h1>
      ) : (
        <>
          <h2 className="my-8 text-xl font-semibold">What Would You Do?</h2>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setSelectOption("A")}
              size={"lg"}
              variant={"outline"}
              className={clsx(
                "cursor-pointer",
                selectOption === "A" && "opacity-50",
              )}
            >
              {optA}
            </Button>
            <Button
              onClick={() => setSelectOption("B")}
              size={"lg"}
              className={clsx(
                "cursor-pointer",
                selectOption === "B" && "opacity-50",
              )}
              variant={"outline"}
            >
              {optB}
            </Button>
          </div>
        </>
      )}
      {isStoryEnd && credits === 0 ? (
        <Button className="cursor-pointer" disabled>
          🔒 Play Again
          <span className="text-muted-foreground text-xs">
            Not enough credits
          </span>
        </Button>
      ) : (
        <Button
          size={"lg"}
          onClick={handleNext}
          disabled={loading || !selectOption}
          className="cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Next"}
        </Button>
      )}
    </div>
  );
};

export default StoryContent;
