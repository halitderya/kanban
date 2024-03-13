"use client";
import React, { useState } from "react";

import Lanecontainer from "@/components/lanecontainer";
import Header from "@/components/header";
import CardModal from "@/components/cardmodal";

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className=" flex flex-col p-2">
        {showModal ? (
          <CardModal
            setShowModal={setShowModal}
            showModal={showModal}
          ></CardModal>
        ) : null}
        <Header />
        <Lanecontainer show={setShowModal}></Lanecontainer>
      </div>
    </>
  );
};

export default Page;
