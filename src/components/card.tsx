import { AppDispatch } from "@/app/store";
import {
  // selectedcardSlice,
  updateCardDataThunk,
} from "@/features/card/cardSlice";
import { selectedCardSlice } from "@/features/card/selectedCardSlice";
import { Card } from "@/types/cardtype";
import { Lane } from "@/types/linetype";
import { motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";

const CardComponent = (props: { card: Card; showModal: any; lane: Lane }) => {
  const dispatch = useDispatch<AppDispatch>();

  function handleClick() {
    props.showModal(true);
    dispatch(selectedCardSlice.actions.selectCard(props.card));
  }

  return (
    <motion.div
      onTap={handleClick}
      className="cardcomponent card w-full  border-solid border-4 rounded-lg p-2 my-1 shadow-lg  border-gray-400 "
    >
      <div className="font-mono">{props.card?.name}</div>
      <br></br>
      <div className="">{props.card?.description}</div>
      <div>{props.card?.owner}</div>
    </motion.div>
  );
};

export default CardComponent;
