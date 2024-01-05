"use client";
import {
  fetchLaneDataThunk,
  fetchLaneIDThunk,
} from "@/features/lane/laneSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Lane } from "@/types/linetype";
import { Card } from "@/types/cardtype";
import LaneElement from "@/components/lane";

const Lanecontainer = () => {
  const lanedata: Lane[] = useSelector(
    (state: RootState) => state.lanedata.data
  );
  const cardData: Card[] = useSelector(
    (state: RootState) => state.carddata.data
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLaneDataThunk());
  }, [dispatch]);
  return (
    <>
      <div className="w-full justify-between h-max-96 gap-6 flex flex-row">
        {lanedata ? (
          lanedata.map((l) => <LaneElement key={l.id} lane={l}></LaneElement>)
        ) : (
          <p>Data is loading or not available.</p>
        )}
      </div>
    </>
  );
};

export default Lanecontainer;
