"use client";
import { fetchLaneDataThunk } from "@/features/lane/laneSlice";
import React, { useEffect, useState } from "react";
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
  }, []);

  return (
    <>
      <motion.div className=" flex-wrap  overflow-auto pb-10">
        <div
          className="lanecontainer box-border font-mono flex-nowrap justify-between flex flex-column 
        "
        >
          {lanedata !== null ? (
            Object.values(lanedata).map((l, index) =>
              l.active ? (
                <LaneElement
                  order={index + 1}
                  setShow={props.show}
                  key={l.id}
                  lane={l}
                />
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
