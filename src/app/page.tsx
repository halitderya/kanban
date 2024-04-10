"use client";
import React, { useState } from "react";

import Lanecontainer from "@/components/lanecontainer";
import Header from "@/components/header";
import CardModal from "@/components/cardmodal";
import LaneSettingsModal from "@/components/settings/laneSettings";
import { ArchivedModal } from "@/components/archivedmodal";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLaneSettingsModal, setshowLaneSettingsModal] = useState(false);
  const [showArchivedModal, setShowArchivedModal] = useState(false);

  return (
    <>
      <div className=" h-dvh  flex flex-col p-2">
        {/* {showModal ? (
          <CardModal
            setShowModal={setShowModal}
            showModal={showModal}
          ></CardModal>
        ) : null} */}
        {showLaneSettingsModal ? (
          <LaneSettingsModal
            setshowLaneSettingsModal={setshowLaneSettingsModal}
            showLaneSettingsModal={showLaneSettingsModal}
          ></LaneSettingsModal>
        ) : null}

        {showArchivedModal ? (
          <ArchivedModal
            setShowArchivedModal={setShowArchivedModal}
            showArchivedModal={showArchivedModal}
          ></ArchivedModal>
        ) : null}

        <Header
          setshowLaneSettingsModal={setshowLaneSettingsModal}
          showLaneSettingsModal={showLaneSettingsModal}
          setShowArchivedModal={setShowArchivedModal}
          showArchivedModal={showArchivedModal}
        />
        <Lanecontainer show={setShowModal}></Lanecontainer>
      </div>
    </>
  );
};

export default Page;
