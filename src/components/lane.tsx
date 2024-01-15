import React, { Ref, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CardComponent from "./card";
import { Lane } from "@/types/linetype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchCardDataThunk,
  fetchCardIDThunk,
  updateCardDataThunk,
} from "@/features/card/cardSlice";

import { Card } from "@/types/cardtype";
/* import { updateCard } from "@/utils/firebase";
 */
const LaneElement = (props: { lane: Lane }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cardsData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  const myRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (myRef?.current) {
      window.addEventListener("resize", () => {
        //  console.log((myRef!.current as HTMLDivElement).getBoundingClientRect());
      });
    }
  }, [myRef?.current]);
  useEffect(() => {
    dispatch(fetchCardDataThunk());
  }, [dispatch]);

  const dropped = (e: PointerEvent, c: Card) => {
    const theElement = window.document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((element) => element.classList.contains("laneitem"))[0];

    const laneId = theElement?.id;
    if (!laneId) {
      console.log("moved to nowhere");
    } else {
      const updated = { ...c, lane_id: Number(laneId) };

      dispatch(updateCardDataThunk(updated)).then((action) => {
        console.log("action: ", action);
      });
    }
  };
  return (
    <div
      id={props.lane.id + ""}
      className="laneitem justify-between flex-col flex  w-full min-h-96 min-w-48 border-solid border-2 rounded-md border-indigo-600"
      ref={myRef}
    >
      <div className="laneborder align-middle border-solid border-2 border-indigo-600">
        {props.lane.name} {"id " + props.lane.id}
      </div>
      <div className="flex flex-col w-full justify-end">
        {cardsData &&
          cardsData.length > 0 &&
          cardsData.map((c) => {
            if (c.lane_id === props.lane.id) {
              return (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onDragEnd={(e) => {
                    dropped(e as PointerEvent, c);
                  }}
                  onClick={(c) => {
                    console.log("carddata: ", cardsData);
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
