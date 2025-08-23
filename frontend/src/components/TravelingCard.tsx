import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import clsx from "clsx";

interface TravelingCardProps {
  title: string;
  icon: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

const TravelingCard = ({
  title,
  icon,
  description,
  onClick,
  className,
}: TravelingCardProps) => {
  return (
    <Card
      className={clsx("cursor-pointer bg-transparent", className)}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg capitalize">
          <span className="mr-2">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription className="">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default TravelingCard;
