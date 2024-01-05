import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CardComponent from "./card";
import { Lane } from "@/types/linetype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchCardDataThunk,
  fetchCardIDThunk,
} from "@/features/card/cardSlice";

import { Card } from "@/types/cardtype";

const LaneElement = (props: { lane: Lane }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cardsData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  useEffect(() => {
    dispatch(fetchCardDataThunk());
  }, [dispatch]);

  return (
    <div className="laneitem justify-between flex-col flex  w-full min-h-96 min-w-48 border-solid border-2 rounded-md border-indigo-600">
      <div className="laneborder align-middle border-solid border-2 border-indigo-600">
        {props.lane.name}
      </div>
      <div className="flex flex-col w-full justify-end">
        {cardsData &&
          cardsData.length > 0 &&
          cardsData.map((c) => {
            if (c.lane === props.lane.id) {
              return (
                <motion.div dragMomentum={false} key={c.id} drag>
                  <CardComponent card={c} />
                </motion.div>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
};

export default LaneElement;
