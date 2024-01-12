"use client";
import {
  fetchLaneDataThunk,
  fetchLaneIDThunk,
} from "@/features/lane/laneSlice";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Lane } from "@/types/linetype";
import { Card } from "@/types/cardtype";
import LaneElement from "@/components/lane";
import {
  LaneData,
  LanePositionState,
  addLane,
} from "@/features/lanePosition/lanePositionSlice";

const Lanecontainer = () => {
  const lanedata: Lane[] = useSelector(
    (state: RootState) => state.lanedata.data
  );
  const cardData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  const lanePositionData: any = useSelector(
    (state: RootState) => state.lanePosition.lanes
  );
  const saveLaneData = (laneId: any, data: any) => {
    localStorage.setItem(laneId, JSON.stringify(data));
  };

  const dispatch = useDispatch<AppDispatch>();
  const laneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    dispatch(fetchLaneDataThunk()).then((action) => {
      if (action.type === fetchLaneDataThunk.fulfilled.type) {
        const lanes = action.payload;
        if (lanes) {
          Object.keys(lanes).forEach((laneId) => {
            const laneData = lanes[laneId];
            dispatch(addLane({ laneId: parseInt(laneId), laneData }));
          });
        }
      }
    });
  }, [dispatch]);

  function gerdata(event: any): void {
    console.log("laneposition: ", lanePositionData, "lanedata: ", lanedata);
  }

  return (
    <>
      <div className="w-full justify-between h-max-96 gap-6 flex flex-row">
        {lanedata ? (
          lanedata.map((l) => (
            <LaneElement
              key={l.id}
              lane={l}
              ref={(el) => (laneRefs.current[l.id] = el)}
            ></LaneElement>
          ))
        ) : (
          <p>Data is loading or not available.</p>
        )}
      </div>
      <button onClick={gerdata}>Click to Get</button>
    </>
  );
};

export default Lanecontainer;
