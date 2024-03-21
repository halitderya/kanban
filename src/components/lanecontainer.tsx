"use client";
import { fetchLaneDataThunk } from "@/features/lane/laneSlice";
import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Lane } from "@/types/linetype";
import LaneElement from "@/components/lane";
import { motion } from "framer-motion";

const Lanecontainer = (props: { show: any }) => {
  const lanedata: Lane[] = useSelector(
    (state: RootState) => state.lanedata.data
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLaneDataThunk());
  }, [lanedata]);

  return (
    <>
      <motion.div layoutScroll className="h-full">
        <div className="lanecontainer box-border font-mono flex-nowrap justify-between flex flex-column">
          {lanedata !== null ? (
            Object.values(lanedata).map((l) =>
              l.active ? (
                <LaneElement setShow={props.show} key={l.id} lane={l} />
              ) : null
            )
          ) : (
            <p>Data is loading or not available.</p>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Lanecontainer;
