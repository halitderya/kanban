import { Card } from "@/types/cardtype";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchCardIDThunk } from "@/features/card/cardSlice";

const CardComponent = (props: { card: Card }) => {
  const carddata: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );
  const dispatch = useDispatch<AppDispatch>();

  const currentCard = carddata.find((x) => x.id === props.card.id);
  return (
    <div className="w-full min-h-24 border-solid border-2 border-indigo-600">
      name: {currentCard?.name}
      <div>{currentCard?.description}</div>
      <div>{currentCard?.owner}</div>
    </div>
  );
};

export default CardComponent;
