import { Card } from "@/types/cardtype";
import React from "react";

const CardComponent = (props: { card: Card }) => {
  return (
    <div className="w-full min-h-24 border-solid border-2 border-indigo-600">
      name: {props.card?.name}
      <div>{props.card?.description}</div>
      <div>{props.card?.owner}</div>
      <div>{props.card?.id}</div>
    </div>
  );
};

export default CardComponent;
