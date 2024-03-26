"use client";
import React, { useState } from "react";

import Lanecontainer from "@/components/lanecontainer";
import Header from "@/components/header";
import CardModal from "@/components/cardmodal";
import LaneSettingsModal from "@/components/settings/laneSettings";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLaneSettingsModal, setshowLaneSettingsModal] = useState(false);

  return (
    <>
      <div className=" flex flex-col p-2">
        {showModal ? (
          <CardModal
            setShowModal={setShowModal}
            showModal={showModal}
          ></CardModal>
        ) : null}
        {showLaneSettingsModal ? (
          <LaneSettingsModal
            setshowLaneSettingsModal={setshowLaneSettingsModal}
            showLaneSettingsModal={showLaneSettingsModal}
          ></LaneSettingsModal>
        ) : null}

        <Header
          setshowLaneSettingsModal={setshowLaneSettingsModal}
          showLaneSettingsModal={showLaneSettingsModal}
        />
        <Lanecontainer show={setShowModal}></Lanecontainer>
      </div>
    </>
  );
};

export default Page;
