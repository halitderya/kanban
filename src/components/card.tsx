import { Card } from "@/types/cardtype";
import React from "react";

const CardComponent = (props: { card: Card }) => {
  return (
    <div className=" card w-full  border-solid border-4 rounded-lg p-2 my-1 shadow-lg  border-gray-400 ">
      <div className="font-mono">{props.card?.name}</div>
      <br></br>
      <div>{props.card?.description}</div>
      <div>{props.card?.owner}</div>
    </div>
  );
};

export default CardComponent;
