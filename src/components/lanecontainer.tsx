"use client";
import { fetchLaneDataThunk } from "@/features/lane/laneSlice";
import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Lane } from "@/types/linetype";
import LaneElement from "@/components/lane";
import { Card } from "@/types/cardtype";

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
      <div className="h-lvh overflow-auto  grow-0">
        <div className="lanecontainer box-border   font-mono flex-nowrap justify-between gap-6 flex flex-column ">
          {lanedata ? (
            lanedata.map((l) => (
              <LaneElement
                setShow={props.show}
                key={l.id}
                lane={l}
              ></LaneElement>
            ))
          ) : (
            <p>Data is loading or not available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Lanecontainer;
