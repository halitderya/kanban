import React, { Ref, useEffect, useRef } from "react";
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
import { updateCard } from "@/utils/firebase";

const LaneElement = (props: { lane: Lane; ref: Ref<any> }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cardsData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  const myRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (myRef?.current) {
      const element = myRef.current;
      const bBox = element.getBoundingClientRect();

      console.log(props.lane.name, myRef?.current.getBoundingClientRect());

      window.addEventListener("resize", () => {
        console.log((myRef!.current as HTMLDivElement).getBoundingClientRect());
      });
    }
  }, [myRef?.current]);
  useEffect(() => {
    dispatch(fetchCardDataThunk());
  }, [dispatch]);

  const dropped = (e: PointerEvent, c: Card) => {
    console.log(
      "clientx",
      e.clientX,
      "clienty",
      e.clientY,
      "cardid: ",
      c.id,
      "card lane from:",
      c.lane
    );
    const theElement = window.document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((element) => element.classList.contains("laneitem"))[0];
    const laneId = theElement?.id;
    if (!laneId) {
      console.log("move to trash");
    } else {
      console.log("update card with the lane id :", laneId);
      const updated = { ...c, lane: Number(laneId) };
      updateCard(updated);
    }
  };
  return (
    <div
      id={props.lane.id + ""}
      className="laneitem justify-between flex-col flex  w-full min-h-96 min-w-48 border-solid border-2 rounded-md border-indigo-600"
      ref={myRef}
    >
      <div className="laneborder align-middle border-solid border-2 border-indigo-600">
        {props.lane.name}
      </div>
      <div className="flex flex-col w-full justify-end">
        {cardsData &&
          cardsData.length > 0 &&
          cardsData.map((c) => {
            if (c.lane === props.lane.id) {
              return (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onDragEnd={(e) => {
                    dropped(e as PointerEvent, c);
                  }}
                  dragMomentum={false}
                  key={c.id}
                  drag
                >
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
