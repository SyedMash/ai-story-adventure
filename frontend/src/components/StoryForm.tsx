"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { storySchema } from "~/schema/story.schema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import TravelingCard from "./TravelingCard";
import {
  adventuresStyle,
  challenges,
  toneAndEnergy,
  travelingBudget,
  travelingWith,
} from "~/constants";
import { Loader2 } from "lucide-react";
import { saveStoryToDatabase } from "~/actions/story.action";

const StoryForm = () => {
  const [travelWith, setTravelWith] = useState("");
  const [travelBudget, setTravelBudget] = useState("");
  const [familyMembers, setFamilyMembers] = useState("");
  const [relationshipDynamics, setRelationshipDynamics] = useState<
    string | null
  >(null);
  const [advStyle, setAdvStyle] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof storySchema>>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      country: "",
      city: "",
      duration: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof storySchema>) => {
    if (travelWith === "girlfriend") {
      if (!relationshipDynamics || !adventuresStyle || !tone || !conflict)
        return;
    } else if (travelWith === "wife") {
      if (!relationshipDynamics || !adventuresStyle || !tone || !conflict)
        return;
    } else if (travelWith === "family") {
      if (!familyMembers) return;
    }
    if (!travelBudget) return;

    try {
      setLoading(true);

      const payload: StoryData = {
        country: data.country,
        city: data.city,
        companion: travelWith,
        budget: travelBudget,
        duration: data.duration,
        relationShipDynamics: relationshipDynamics,
        adventuresStyle: advStyle,
        tone: tone,
        conflict: conflict,
      };

      const response = await fetch("http://127.0.0.1:8000/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("something went wrong");
      const returnedData = (await response.json()) as ReturnedData;
      await saveStoryToDatabase(payload, returnedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold capitalize lg:text-2xl">
                  Country
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Japan" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold capitalize lg:text-2xl">
                  City
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Tokyo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h2 className="text-xl font-bold capitalize lg:text-2xl">
              Companion
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {travelingWith.map((tw) => (
                <TravelingCard
                  key={tw.title}
                  {...tw}
                  onClick={() => setTravelWith(tw.title)}
                  className={`${tw.title === travelWith && "opacity-50"}`}
                />
              ))}
            </div>
            {travelWith === "family" && (
              <div className="mt-4 space-y-3">
                <p>How many family members?</p>
                <Input
                  type="number"
                  placeholder="5"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  min={3}
                />
              </div>
            )}
            {travelWith === "girlfriend" && (
              <div className="mt-4 space-y-4 rounded-lg border bg-gradient-to-r from-pink-200 p-3">
                <h3 className="font-semibold lg:text-lg">
                  Relationship Dynamics
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <TravelingCard
                    title="New love"
                    icon="💘"
                    description="dating phase, flirty + playful tone"
                    onClick={() => setRelationshipDynamics("New Love")}
                    className={`${"New Love" === relationshipDynamics && "opacity-50"}`}
                  />
                  <TravelingCard
                    title="Serious RelationShip"
                    icon="💖"
                    description="emotional, deeper connection, some drama"
                    onClick={() =>
                      setRelationshipDynamics("Serious RelationShip")
                    }
                    className={`${"Serious RelationShip" === relationshipDynamics && "opacity-50"}`}
                  />
                </div>
                <h3 className="font-semibold lg:text-lg">Adventures Style</h3>
                <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {adventuresStyle.map((adv) => (
                    <TravelingCard
                      key={adv.title}
                      {...adv}
                      onClick={() => setAdvStyle(adv.title)}
                      className={`${adv.title === advStyle && "opacity-50"}`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold lg:text-lg">Tone / Energy</h3>
                <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {toneAndEnergy.map((tae) => (
                    <TravelingCard
                      key={tae.title}
                      {...tae}
                      onClick={() => setTone(tae.title)}
                      className={`${tae.title === tone && "opacity-50"}`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold lg:text-lg">
                  Conflict / Challenge
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {challenges.map((challenge) => (
                    <TravelingCard
                      key={challenge.title}
                      {...challenge}
                      onClick={() => setConflict(challenge.title)}
                      className={`${challenge.title === conflict && "opacity-50"}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {travelWith === "wife" && (
              <div className="mt-4 space-y-4 rounded-lg border bg-gradient-to-r from-pink-300 p-3">
                <h3 className="font-semibold lg:text-lg">
                  Relationship Dynamics
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-6">
                  <TravelingCard
                    title="New love"
                    icon="💘"
                    description="dating phase, flirty + playful tone"
                    onClick={() => setRelationshipDynamics("New Love")}
                    className={`${"New Love" === relationshipDynamics && "opacity-50"}`}
                  />
                  <TravelingCard
                    title="Married Life"
                    icon="💍"
                    description="long-term love, cozy + sometimes chaotic adventures"
                    onClick={() => setRelationshipDynamics("Married Life")}
                    className={`${"Married Life" === relationshipDynamics && "opacity-50"}`}
                  />
                  <TravelingCard
                    title="Serious RelationShip"
                    icon="💖"
                    description="emotional, deeper connection, some drama"
                    onClick={() =>
                      setRelationshipDynamics("Serious RelationShip")
                    }
                    className={`${"Serious RelationShip" === relationshipDynamics && "opacity-50"}`}
                  />
                </div>
                <h3 className="font-semibold lg:text-lg">Adventures Style</h3>
                <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {adventuresStyle.map((adv) => (
                    <TravelingCard
                      key={adv.title}
                      {...adv}
                      onClick={() => setAdvStyle(adv.title)}
                      className={`${adv.title === advStyle && "opacity-50"}`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold lg:text-lg">Tone / Energy</h3>
                <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {toneAndEnergy.map((tae) => (
                    <TravelingCard
                      key={tae.title}
                      {...tae}
                      onClick={() => setTone(tae.title)}
                      className={`${tae.title === tone && "opacity-50"}`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold lg:text-lg">
                  Conflict / Challenge
                </h3>
                <div className="mt-4">
                  <TravelingCard
                    title="Random Twist"
                    icon="🎲"
                    description="AI throws chaos: teleportation, magic, time travel"
                    onClick={() => setConflict("Random Twist")}
                    className={`${"Random Twist" === conflict && "opacity-50"}`}
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold capitalize lg:text-2xl">Budget</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {travelingBudget.map((tb) => (
                <TravelingCard
                  key={tb.title}
                  {...tb}
                  onClick={() => setTravelBudget(tb.title)}
                  className={`${tb.title === travelBudget && "opacity-50"}`}
                />
              ))}
            </div>
          </div>
          <FormField
            name="duration"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold capitalize lg:text-2xl">
                  Duration (days)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="3 Days"
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size={"lg"} className="w-full cursor-pointer">
          {loading ? <Loader2 className="animate-spin" /> : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default StoryForm;
