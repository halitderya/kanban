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
import CardModal from "./cardmodal";

////IMPORTS/////

const LaneElement = (props: { lane: Lane; setShow: any; order: number }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const controls = useAnimationControls();
  const dispatch = useDispatch<AppDispatch>();
  const searchterm: string = useSelector(
    (state: RootState) => state.searchterm.value
  );
  const cardsData: { [key: string]: Card } | null = useSelector(
    (state: RootState) => state.carddata.data
  );
  const lanedata: { [key: string]: Lane } | null = useSelector(
    (state: RootState) => state.lanedata.data
  );

  //////Reading Directly HTML///
  const laneCollection = document.getElementsByClassName("laneitem");
  const laneCollectionLenght = laneCollection.length;

  //console.log("LastLaneID: ", lastLaneID);

  //////VARIABLES////////////

  // useEffect(() => {
  //   dispatch(fetchCardDataThunk("lane.tsx"));
  // }, []);

  const handleCardDropped = (e: PointerEvent, c: Card) => {
    const theElement = window.document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((element) => element.classList.contains("laneitem"))[0];

    const laneId = theElement?.id;
    if (!laneId) {
      ////////Card Moved to Nowhere

      console.log("card moved to nowhere");

      controls.start({ x: 0, y: 0 });
    } else {
      //////Card Moved to Somewhere
      if (laneId === c.lane.toString()) {
        console.log("dropped same line");
        controls.start({ x: 0, y: 0 });

        return;
      }

      let updated;

      updated = {
        ...c,
        lane: Number(laneId),
      };

      dispatch(updateCardDataThunk(updated))
        .then((action) => {})
        .then(() => {
          dispatch(fetchCardDataThunk());
        });
    }
  };

  //////HandleCardDropped//////

  return (
    <>
      {showModal ? (
        <CardModal
          lane={props.lane}
          setShowModal={setShowModal}
          showModal={showModal}
        ></CardModal>
      ) : null}
      <motion.div
        // drag
        animate={controls}
        dragMomentum={false}
        // onDragEnd={(e) => {
        //   handleLaneDrop(e as PointerEvent, props.lane);
        // }}
        id={props.lane.id + ""}
        className="laneitem "
      >
        <div className=" flex flex-col justify-between w-full items-center laneheader mb-2 font-mono p-2 ">
          <label className=" mb-4 text-center">{props.lane.name}</label>

          <motion.img
            id={props.lane.id.toString()}
            drag={false}
            onTap={() => {
              setShowModal(true);
            }}
            alt="Add New Card"
            whileHover={{ scale: 2.5 }}
            src="/svg/add_icon.svg"
          ></motion.img>
        </div>

        <hr></hr>

        <div className=" cardcontainer flex  flex-col w-full  p-2 justify-start">
          {cardsData &&
            Object.values(cardsData)
              .filter((f) =>
                f.name.toLowerCase().includes(searchterm.toLowerCase())
              )
              .map((c) => {
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
                        showModal={setShowModal}
                        key={c.id}
                        card={c}
                        lane={props.lane}
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
