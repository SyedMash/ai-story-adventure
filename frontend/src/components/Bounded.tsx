import clsx from "clsx";
import React from "react";

interface BoundedProps {
  className?: string;
  children: React.ReactNode;
}

const Bounded = ({ children, className }: BoundedProps) => {
  return (
    <section
      className={clsx("container mx-auto px-4 py-12 2xl:px-0", className)}
    >
      {children}
    </section>
  );
};

export default Bounded;
