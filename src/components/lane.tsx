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
import CardModal from "./cardmodal";

const LaneElement = (props: { lane: Lane; setShow: any }) => {
  const controls = useAnimationControls();

  const dispatch = useDispatch<AppDispatch>();
  const cardsData: { [key: string]: Card } | null = useSelector(
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
      let updated;
      c.lane === Number(8)
        ? (updated = { ...c, lane: Number(laneId), active: true })
        : (updated = { ...c, lane: Number(laneId), active: false });

      // const updated = { ...c, lane: Number(laneId)  };
      console.log(updated);

      controls.start({ x: 0, y: 0 });

      dispatch(updateCardDataThunk(updated)).then((action) => {});
    }
  };
  const clicked = (e: any, c: Card) => {};

  return (
    <>
      <motion.div
        id={props.lane.id + ""}
        className="laneitem font-sans justify-between flex-col flex max-w-64  min-w-56 border-solid border-4 rounded-md border-gray-300 shadow-lg"
      >
        <div className=" flex flex-col justify-between w-full items-center laneheader mb-2 font-mono p-2 ">
          <label className=" mb-4 text-center">{props.lane.name}</label>

          <motion.img
            onTap={() => {
              props.setShow(true);
            }}
            alt="Add New Card"
            whileHover={{ scale: 2.5 }}
            src="/svg/add_icon.svg"
          ></motion.img>
        </div>

        <hr></hr>

        <div className=" cardcontainer flex  flex-col w-full  p-2 justify-start">
          {cardsData &&
            Object.values(cardsData).map((c) => {
              if (c.lane === props.lane.id) {
                return (
                  <motion.div
                    className="motiondiv border-none"
                    dragElastic={0.1}
                    whileDrag={{ rotate: 10 }}
                    z-index="50"
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
                    <CardComponent
                      showModal={props.setShow}
                      key={c.id}
                      card={c}
                    />
                  </motion.div>
                );
              }
              return null;
            })}
        </div>
      </motion.div>
    </>
  );
};

export default LaneElement;
