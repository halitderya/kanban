"use client";
import { fetchLaneDataThunk } from "@/features/lane/laneSlice";
import React, { use, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Lane } from "@/types/linetype";
import LaneElement from "@/components/lane";

import {
  fetchCardDataThunk,
  populateAllCardsThunk,
} from "@/features/card/cardSlice";

const Lanecontainer = () => {
  const lanedata: Lane[] = useSelector(
    (state: RootState) => state.lanedata.data
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLaneDataThunk());
  }, []);

  function getcards() {
    dispatch(populateAllCardsThunk()).then(() => {
      dispatch(fetchCardDataThunk());
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
