import React, { Ref, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import CardComponent from "./card";
import { Lane } from "@/types/linetype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchCardDataThunk,
  updateCardDataThunk,
} from "@/features/card/cardSlice";

import { Card } from "@/types/cardtype";

const LaneElement = (props: { lane: Lane }) => {
  const controls = useAnimationControls();

  const dispatch = useDispatch<AppDispatch>();
  const cardsData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  useEffect(() => {
    dispatch(fetchCardDataThunk());
  }, []);

  const dropped = (e: PointerEvent, c: Card) => {
    const theElement = window.document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((element) => element.classList.contains("laneitem"))[0];

    const laneId = theElement?.id;
    if (!laneId) {
      console.log("moved to nowhere");
      controls.start({ x: 0, y: 0 });
    } else {
      const updated = { ...c, lane: Number(laneId) };
      controls.start({ x: 0, y: 0 });
      dispatch(updateCardDataThunk(updated)).then((action) => {});
    }
  };
  const clicked = (e: any, c: Card) => {};

  return (
    <>
      <div
        id={props.lane.id + ""}
        className="laneitem justify-between flex-col flex  w-full min-h-96 min-w-48 border-solid border-2 rounded-md border-indigo-600"
      >
        <div className="laneborder align-middle border-solid border-2 border-indigo-600">
          {props.lane.name} {"id " + props.lane.id}
        </div>
        <div className="flex flex-col w-full justify-end">
          {cardsData &&
            Object.values(cardsData).map((c) => {
              if (c.lane === props.lane.id) {
                return (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    animate={controls}
                    onDragEnd={(e) => {
                      dropped(e as PointerEvent, c);
                    }}
                    onClick={(e) => {
                      clicked(e as any, c);
                    }}
                    dragMomentum={false}
                    key={c.id}
                    drag
                  >
                    {" "}
                    <CardComponent key={c.id} card={c} />
                  </motion.div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </>
  );
};

export default LaneElement;
