import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

interface StoriesCardProps {
  id: string;
  name: string;
  country: string;
  companion: string;
  budget: string;
  duration: string;
  relationShipDynamics: string | null;
  adventuresStyle: string | null;
  tone: string | null;
  conflict: string | null;
  createdAt: Date;
}

const StoriesCard = ({
  id,
  name,
  country,
  companion,
  budget,
  duration,
  relationShipDynamics,
  adventuresStyle,
  tone,
  conflict,
  createdAt,
}: StoriesCardProps) => {
  return (
    <Link href={`/stories/${id}`}>
      <Card className="relative cursor-pointer bg-transparent">
        <CardHeader>
          <CardTitle className="capitalize">{name}</CardTitle>
          <CardDescription>{country}</CardDescription>
        </CardHeader>
        <CardContent className="">
          <p>
            Traveling With:{" "}
            <span className="font-semibold capitalize">{companion}</span>
          </p>
          <p>
            Budget: <span className="font-semibold capitalize">{budget}</span>
          </p>
          <p>
            Duration:{" "}
            <span className="font-semibold capitalize">{duration}</span>
          </p>
          <p>
            Relationship Dynamics:{" "}
            <span className="font-semibold capitalize">
              {relationShipDynamics}
            </span>
          </p>
          <p>
            Adventures Style:{" "}
            <span className="font-semibold capitalize">{adventuresStyle}</span>
          </p>
          <p>
            Tone: <span className="font-semibold capitalize">{tone}</span>
          </p>
          <p>
            Conflict:{" "}
            <span className="font-semibold capitalize">{conflict}</span>
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground">
            {createdAt.toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default StoriesCard;
