import React, { Ref, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  const [loaded, setLoaded] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const dispatch = useDispatch<AppDispatch>();
  const cardsData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  useEffect(() => {
    dispatch(fetchCardDataThunk());
  }, [loaded]);

  const dragStarted = (e: PointerEvent, c: Card) => {
    setInitialPosition({ x: e.clientX, y: e.clientY });
  };
  const dropped = (e: PointerEvent, c: Card) => {
    const theElement = window.document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((element) => element.classList.contains("laneitem"))[0];

    const laneId = theElement?.id;
    if (!laneId) {
      console.log("moved to nowhere");

      setLoaded(!loaded);
    } else {
      const updated = { ...c, lane: Number(laneId) };

      dispatch(updateCardDataThunk(updated)).then((action) => {
        console.log("action: ", action);
        setLoaded(!loaded);
      });
    }
  };
  const clicked = (e: any, c: Card) => {};
  if (cardsData) {
    console.log("true");
    console.log(cardsData);
  }

  return (
    <>
      <div
        id={props.lane.id + ""}
        className="laneitem justify-between flex-col flex  w-full min-h-96 min-w-48 border-solid border-2 rounded-md border-indigo-600"
        /*       ref={myRef}
         */
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
                    onDragEnd={(e) => {
                      dropped(e as PointerEvent, c);
                    }}
                    onDragStart={(e) => {
                      dragStarted(e as PointerEvent, c);
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
