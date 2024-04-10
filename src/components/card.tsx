import { AppDispatch } from "@/app/store";

import { selectedCardSlice } from "@/features/card/selectedCardSlice";
import { Card } from "@/types/cardtype";
import { Lane } from "@/types/linetype";
import { motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";
import { capitalizeFirstLetters } from "@/utils/capitalizefirstletter";
import ProfileIconInline from "./iconcomponents/profileicon-inline";

const CardComponent = (props: { card: Card; showModal: any; lane: Lane }) => {
  const dispatch = useDispatch<AppDispatch>();

  function handleClick() {
    props.showModal(true);
    dispatch(selectedCardSlice.actions.selectCard(props.card));
  }

  return (
    <motion.div onTap={handleClick} className="card ">
      <div className="font-mono break-words font-bold mb-2">
        {props.card?.name.toUpperCase()}
      </div>{" "}
      <div className="mb-4">
        {props.card.description
          ? capitalizeFirstLetters(props.card.description)
          : ""}
      </div>
      <div className="flex items-center justify-end flex-row ">
        <ProfileIconInline></ProfileIconInline>

        <div>{capitalizeFirstLetters(props.card?.owner)}</div>
      </div>
    </motion.div>
  );
};

export default CardComponent;
