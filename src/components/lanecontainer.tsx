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
import { populateAllCardsThunk } from "@/features/card/cardSlice";

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

  function getcards() {
    dispatch(populateAllCardsThunk()).then((action) => {
      console.log("action from populateallcardsthunk", action);
    });
  }

  return (
    <>
      <div className="w-full justify-between h-max-96 gap-6 flex flex-row">
        {lanedata ? (
          lanedata.map((l) => <LaneElement key={l.id} lane={l}></LaneElement>)
        ) : (
          <p>Data is loading or not available.</p>
        )}
      </div>
      <button onClick={getcards}>Click to fetch cards</button>
    </>
  );
};

export default Lanecontainer;
