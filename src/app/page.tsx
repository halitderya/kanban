"use client";
import React, { useState } from "react";

import Lanecontainer from "@/components/lanecontainer";
import Header from "@/components/header";

const Page = () => {
  return (
    <>
      <div className="relative">
        <Header />
        <div className=" hidden absolute top-0 w-full h-full bg-transparent backdrop-blur-sm justify-center ">
          <div className="w-96  shadow-lg absolute top-36 h-96 border-2 bg-slate-100 rounded-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum soluta
            tempora, molestiae aperiam quae expedita velit maiores reprehenderit
            provident nisi?
          </div>
        </div>
        <Lanecontainer></Lanecontainer>
      </div>
    </>
  );
};

export default Page;
