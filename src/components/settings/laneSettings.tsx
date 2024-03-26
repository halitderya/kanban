"use client";
import React, { useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Reorder, motion, useDragControls } from "framer-motion";
import { updateCard, updateCardDataThunk } from "@/features/card/cardSlice";
import { selectCard } from "@/features/card/selectedCardSlice";
import { current } from "@reduxjs/toolkit";
import { Lane } from "@/types/linetype";
import {
  fetchLaneDataThunk,
  updateLaneDataThunk,
} from "@/features/lane/laneSlice";

const LaneSettingsModal = (props: {
  setshowLaneSettingsModal: any;
  showLaneSettingsModal: any;
}) => {
  const lanedata: { [key: string]: Lane } | null = useSelector(
    (state: RootState) => state.lanedata.data
  );
  const laneArray = lanedata ? Object.values(lanedata) : [];

  const [items, setItems] = useState(laneArray);
  const dispatch = useDispatch<AppDispatch>();

  function handleoutsideclick() {
    props.setshowLaneSettingsModal(false);
    dispatch(fetchLaneDataThunk());
  }

  const sliderVariants = {
    checked: { x: 24 },
    unchecked: { x: 0 },
  };

  useEffect(() => {}, [lanedata]);

  const backgroundVariants = {
    unchecked: { backgroundColor: "#68D391" },
    checked: { backgroundColor: "#d25555" },
  };

  function LaneActiveChanged(lane: Lane) {
    const updatedlane: Lane = {
      ...lane,
      active: !lane.active,
    };
    dispatch(updateLaneDataThunk(updatedlane));
  }
  let LaneArray;
  if (lanedata) {
    LaneArray = Array.from(Object.values(lanedata));
  }
  function handleReorder(newOrder: Lane[]) {
    const updatedLanes = newOrder.map((lane, index) => ({
      ...lane,
      order: index,
    }));
    setItems(updatedLanes);

    updatedLanes.forEach((lane) => {
      dispatch(updateLaneDataThunk(lane));
    });
  }
  if (props.showLaneSettingsModal) {
    return (
      <div
        className="bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center z-40"
        onClick={handleoutsideclick}
      >
        <div
          className="modalwindow shadow-xl p-6 overflow-y-auto overflow-x-hidden flex-grow-0 shadow-gray-400 w-auto hover:bg-slate-200 laneitem bg-slate-200 h-auto font-sans justify-between flex-col flex max-w-[400px] min-w-[300px] min-h-52 max-h-[600px] border-solid border-4 rounded-lg border-gray-400 z-1000"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-sans self-start font-extralight mb-4">
            Lane Settings
          </div>
          <Reorder.Group
            className="w-full"
            axis="y"
            values={items}
            onReorder={handleReorder}
          >
            {items.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="cardmain flex flex-row my-2 items-center w-full justify-between ">
                  <div className="flex-grow">{item.name}</div>
                  <div>
                    <div>
                      <motion.div
                        key={item.id}
                        animate={item.active ? "unchecked" : "checked"}
                        className="relative w-16 h-8 flex items-center flex-shrink-0 ml-4 p-1 rounded-full  cursor-pointer z-50"
                        variants={backgroundVariants}
                        onTap={() => {
                          LaneActiveChanged(item);
                        }}
                      >
                        <motion.span
                          key={item.id}
                          className="w-8 h-6 bg-white rounded-full shadow-md flex justify-center items-center"
                          layout
                          variants={sliderVariants}
                        >
                          {item.active ? (
                            <motion.div
                              className="w-4 h-4 z-40"
                              animate="unchecked"
                            />
                          ) : null}
                        </motion.span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    );
  }
  return null;
};

export default LaneSettingsModal;
