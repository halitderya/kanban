import React, { useEffect, useRef, useState } from "react";
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

import {
  fetchLaneDataThunk,
  updateLaneDataThunk,
} from "@/features/lane/laneSlice";
////IMPORTS/////

const LaneElement = (props: { lane: Lane; setShow: any; order: number }) => {
  const controls = useAnimationControls();
  const dispatch = useDispatch<AppDispatch>();

  const cardsData: { [key: string]: Card } | null = useSelector(
    (state: RootState) => state.carddata.data
  );
  const lanedata: { [key: string]: Lane } | null = useSelector(
    (state: RootState) => state.lanedata.data
  );

  //////Reading Directly HTML///
  const laneCollection = document.getElementsByClassName("laneitem");
  const laneCollectionLenght = laneCollection.length;
  const lastLaneID = laneCollection.item(laneCollectionLenght - 1)?.id;

  //console.log("LastLaneID: ", lastLaneID);

  //////VARIABLES////////////

  useEffect(() => {
    dispatch(fetchCardDataThunk());
  }, [lanedata]);

  ///////handleLaneDrop//////
  // function handleLaneDrop(e: PointerEvent, l: Lane) {
  //   const droppedplaceholder = window.document
  //     .elementsFromPoint(e.clientX, e.clientY)
  //     .filter((element) => element.classList.contains("laneplaceholder"))[0];

  //   const droppedplaceholderid = droppedplaceholder?.id;
  //   if (!droppedplaceholderid) {
  //     /////Lane moved to nowhere
  //     controls.start({ x: 0, y: 0 });
  //   }
  //   /////Lane Moved on a placeholder
  //   else {
  //     let updated: Lane;

  //     updated = {
  //       ...l,

  //       order: Number(droppedplaceholder.id),
  //     };
  //     dispatch(updateLaneDataThunk(updated)).then(() => {
  //       dispatch(fetchLaneDataThunk()).then(() => {
  //         if (lanedata) {
  //           const laneDataArray = Array.from(Object.values(lanedata));
  //           const laneItemArray = Array.from(
  //             document.getElementsByClassName("laneitem")
  //           );

  //           laneDataArray.forEach((ld) => {
  //             var targetElement = laneItemArray.find(
  //               (element) => element.id === ld.id.toString()
  //             );

  //             var prevSibling = targetElement
  //               ? targetElement.previousElementSibling
  //               : null;

  //             console.log("ld: ", ld.name, "prevSib: ", prevSibling?.id);

  //             if (prevSibling) {
  //               let updated;
  //               updated = {
  //                 ...l,
  //                 order: Number(prevSibling.id),
  //               };

  //               dispatch(updateLaneDataThunk(updated));
  //             }
  //           });
  //         }
  //       });
  //     });

  //     controls.start({ x: 0, y: 0 });

  //     /////NERDE KALDIK?  GERI KALAN LANE'LERIN ORDER'LARI DEGISMESI LAZIM
  //   }
  // }
  ///////handleLaneDropENDED//////
  ///ordering test

  ////ordering test ENDED////
  //////HandleCardDropped//////
  const handleCardDropped = (e: PointerEvent, c: Card) => {
    const theElement = window.document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((element) => element.classList.contains("laneitem"))[0];

    const laneId = theElement?.id;
    if (!laneId) {
      ////////Card Moved to Nowhere
      controls.start({ x: 0, y: 0 });
    } else {
      //////Card Moved to Somewhere
      let updated;

      updated = {
        ...c,
        lane: Number(laneId),
      };

      //     controls.start({ x: 0, y: 0 });

      dispatch(updateCardDataThunk(updated)).then((action) => {});
    }
  };

  //////HandleCardDropped//////

  return (
    <>
      <div
        id={props.order.toString()}
        className="laneplaceholder w-24 h-auto  flex-grow border-red-400 border-dotted"
      ></div>
      <motion.div
        // drag
        animate={controls}
        dragMomentum={false}
        // onDragEnd={(e) => {
        //   handleLaneDrop(e as PointerEvent, props.lane);
        // }}
        id={props.lane.id + ""}
        className="laneitem font-sans justify-between flex-col flex max-w-64  min-w-48 border-solid border-4 rounded-md border-gray-300 shadow-lg"
      >
        <div className=" flex flex-col justify-between w-full items-center laneheader mb-2 font-mono p-2 ">
          <label className=" mb-4 text-center">{props.lane.name}</label>

          <motion.img
            drag={false}
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
              if (c.lane === props.lane.id && !c.archived) {
                return (
                  <motion.div
                    className="motiondiv border-none"
                    dragElastic={0.1}
                    whileDrag={{ rotate: 10 }}
                    z-index="50"
                    whileHover={{ scale: 1.1 }}
                    animate={controls}
                    onDragEnd={(e) => {
                      handleCardDropped(e as PointerEvent, c);
                    }}
                    dragMomentum={false}
                    key={c.id}
                    drag
                  >
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
      {props.lane.id === Number(lastLaneID) && (
        <div
          id={(props.order + 1).toString()}
          className="laneplaceholder w-24 h-auto  flex-grow border-red-400 border-dotted"
        ></div>
      )}
    </>
  );
};

export default LaneElement;
