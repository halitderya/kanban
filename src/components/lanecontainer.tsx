"use client";
import { fetchLaneDataThunk } from "@/features/lane/laneSlice";
import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Lane } from "@/types/linetype";
import LaneElement from "@/components/lane";
import { Card } from "@/types/cardtype";

const Lanecontainer = () => {
  const lanedata: Lane[] = useSelector(
    (state: RootState) => state.lanedata.data
  );
  const [showmodal, setShowmodal] = useState(false);
  const [selectedCard, setSelectedCard] = useState({} as Card);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLaneDataThunk());
  }, []);

  return (
    <>
      <div className="lanecontainer font-mono flex-nowrap justify-between gap-6 flex flex-column ">
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
