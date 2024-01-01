"use client";
import React, { useEffect } from "react";
import { getLanes } from "../features/lane/laneSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { UnknownAction } from "@reduxjs/toolkit";
const Page = () => {
  const dispatch = useDispatch();
  const { lanes } = useSelector((state: RootState) => state.lanes);
  console.log(dispatch);

  useEffect(() => {
    dispatch(getLanes() as unknown as UnknownAction);
  });

  return <div>test</div>;
};

export default Page;
