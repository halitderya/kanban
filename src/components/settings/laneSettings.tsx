"use client";
import React, { useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Reorder, motion, useDragControls } from "framer-motion";
import { updateCard, updateCardDataThunk } from "@/features/card/cardSlice";
import { selectCard } from "@/features/card/selectedCardSlice";
import { current } from "@reduxjs/toolkit";
import { Lane } from "@/types/linetype";
import {
  addNewLaneThunk,
  deleteSingleLaneThunk,
  fetchLaneDataThunk,
  updateLaneDataThunk,
} from "@/features/lane/laneSlice";

////declarations

const sliderVariants = {
  checked: { x: 24 },
  unchecked: { x: 0 },
};

const backgroundVariants = {
  unchecked: { backgroundColor: "#68D391" },
  checked: { backgroundColor: "#d25555" },
};

/////declarations ended

//////main function//////////

const LaneSettingsModal = (props: {
  setshowLaneSettingsModal: any;
  showLaneSettingsModal: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const lanedata: { [key: string]: Lane } | null = useSelector(
    (state: RootState) => state.lanedata.data
  );
  const laneArray = lanedata ? Object.values(lanedata) : [];

  const carddata: { [key: string]: Card } | null = useSelector(
    (state: RootState) => state.carddata.data
  );

  const [items, setItems] = useState(laneArray);
  const [showAddLaneModal, setShowAddLaneModal] = useState<boolean>(false);
  const [newLaneName, setNewLaneName] = useState<string>("");
  const [newLaneDesc, setNewLaneDesc] = useState<string>("");
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [dbID, setDbID] = useState<string>("");

  function handleoutsideclick(e: React.SyntheticEvent) {
    props.setshowLaneSettingsModal(false);
    setShowAddLaneModal(false);
    dispatch(fetchLaneDataThunk());
  }

  function DeleteConfirmed(e: React.SyntheticEvent) {
    e.preventDefault();
    dispatch(deleteSingleLaneThunk(dbID));
  }

  function HandleDeletability(id: number) {
    const cardArray = carddata ? Object.values(carddata) : [];

    const hasCards = cardArray.find((c) => c.lane === id);

    if (hasCards !== undefined) {
      setCanDelete(false);
    } else {
      const tobedeleted = laneArray.find((l) => l.id === id)?.dbid;

      if (tobedeleted !== undefined) {
        setCanDelete(true);
        setDbID(tobedeleted);
      }
    }
  }
  function LaneActiveChanged(lane: Lane) {
    const updatedlane: Lane = {
      ...lane,
      active: !lane.active,
    };

    dispatch(updateLaneDataThunk(updatedlane));
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === lane.id ? updatedlane : item))
    );
  }

  function handleNewLaneAdded(e: React.SyntheticEvent) {
    e.stopPropagation();

    if (newLaneName !== "" && newLaneDesc !== "") {
      //we gonna create a new line here

      setNewLaneDesc("");
      setNewLaneName("");
      setShowAddLaneModal(false);

      const lastID = Math.max(...items.map((o) => o.id)) + 1;
      const lastOrder = Math.max(...items.map((o) => o.order)) + 1;

      const newLane = {
        id: lastID,
        dbid: "",
        name: newLaneName,
        description: newLaneDesc,
        order: lastOrder,
        active: true,
        default: false,
      };

      dispatch(addNewLaneThunk(newLane)).then((e) => {
        setItems((currentItems) => [...currentItems, e.meta.arg]);
      });
    } else {
      console.error("error 1204");
      return;
    }
  }
  function handleFormEnable(otherprop: string, e: React.SyntheticEvent) {
    if (otherprop !== "" && (e.target as HTMLInputElement).value !== "") {
      setSubmitEnabled(true);
    } else {
      setSubmitEnabled(false);
    }
  }
  function handleReorder(newOrder: Lane[]) {
    const updatedLanes = newOrder.map((lane, index) => ({
      ...lane,
      order: index,
    }));
    setItems(updatedLanes);

    updatedLanes.forEach((lane) => {
      dispatch(updateLaneDataThunk(lane));
    });
  }
  /////
  if (props.showLaneSettingsModal) {
    return (
      <div
        className=" bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center "
        onClick={(e) => handleoutsideclick(e)}
      >
        {showDeletionConfirmation && (
          <div className="addlanemodal shadow-xl fixed p-6 overflow-y-auto overflow-x-hidden flex-grow-0 shadow-gray-400  hover:bg-slate-200  bg-slate-200  font-sans justify-between flex-col flex w-96  h-min-48 border-solid border-4 rounded-lg border-gray-400 z-[1000]">
            {canDelete ? (
              <div className="flex flex-col w-full">
                <h3>Are you sure you want to delete this lane?</h3>

                <div className="w-full flex space-between center mt-4 justify-around gap-">
                  <button
                    onClick={(e) => {
                      DeleteConfirmed(e);
                    }}
                    className=" formsubmit min-w-24 bg-slate-400"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeletionConfirmation(false);
                      setCanDelete(false);
                      setDbID("");
                    }}
                    className="formsubmit min-w-24 bg-slate-400"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <p>Lane has cards, hence cannot be deleted.</p>
            )}
            {}
          </div>
        )}
        {showAddLaneModal ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="addlanemodal shadow-xl fixed p-6 overflow-y-auto overflow-x-hidden flex-grow-0 shadow-gray-400  hover:bg-slate-200  bg-slate-200  font-sans justify-between flex-col flex w-96  h-min-48 border-solid border-4 rounded-lg border-gray-400 z-[1000]"
          >
            <div className="block mb-12 text-lg font-medium text-gray-900 dark:text-white">
              Add new lane
            </div>
            <form>
              <label className="forminputlabel" htmlFor="inputnewlanedesc">
                Lane Name
              </label>
              <input
                required
                className="forminput"
                onChange={(e) => {
                  setNewLaneName(e.target.value);
                  handleFormEnable(newLaneDesc, e);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                value={newLaneName}
              ></input>
              <label className="forminputlabel" htmlFor="inputnewlanedesc">
                Lane Description
              </label>
              <input
                id="inputnewlanedesc"
                className="forminput"
                required
                onChange={(e) => {
                  setNewLaneDesc(e.target.value);
                  handleFormEnable(newLaneName, e);
                }}
                value={newLaneDesc}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></input>

              <input
                className=" mt-4 self-end formsubmit disabled:font-extralight disabled:bg-gray-300 enabled:font-bold"
                disabled={!submitEnabled}
                value="Save Lane"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewLaneAdded(e);
                }}
              ></input>
            </form>
          </div>
        ) : null}
        <div
          className="modalwindow shadow-xl p-6 overflow-y-auto overflow-x-hidden flex-grow-0 shadow-gray-400 w-auto hover:bg-slate-200  bg-slate-200 h-auto font-sans justify-between flex-col flex max-w-[400px] min-w-[300px] min-h-52 max-h-[600px] border-solid border-4 rounded-lg border-gray-400 z-[700]"
          onClick={(e) => {
            e.stopPropagation();
            setShowAddLaneModal(false);
            setShowDeletionConfirmation(false);
          }}
        >
          <div className="flex flex-row w-full justify-between mb-8 ">
            <div className="font-sans self-start font-extralight flex   ">
              Lane Settings
            </div>
            <motion.img
              drag={false}
              onTap={() => {
                setShowAddLaneModal(true);
              }}
              alt="Add New Card"
              whileHover={{ scale: 1.5 }}
              src="/svg/add_icon.svg"
            ></motion.img>{" "}
          </div>

          <Reorder.Group
            className="w-full"
            axis="y"
            values={items}
            onReorder={handleReorder}
          >
            {items.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="cardmain flex flex-row my-2 items-center w-full justify-between ">
                  <div className="flex-grow">{item.name}</div>
                  <div>
                    <div>
                      <motion.div
                        key={item.dbid}
                        animate={item.active ? "unchecked" : "checked"}
                        className="relative w-16 h-8 flex items-center flex-shrink-0 ml-4 p-1 rounded-full  cursor-pointer z-50"
                        variants={backgroundVariants}
                        onTap={() => {
                          LaneActiveChanged(item);
                        }}
                      >
                        <motion.span
                          key={item.id}
                          className="w-8 h-6 bg-white rounded-full shadow-md flex justify-center items-center"
                          layout
                          variants={sliderVariants}
                        >
                          {item.active ? (
                            <motion.div
                              className="w-4 h-4 z-40"
                              animate="unchecked"
                            />
                          ) : null}
                        </motion.span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="ml-2">
                    {!item.default ? (
                      <motion.img
                        id={item.dbid.toString()}
                        drag={false}
                        onTap={(e) => {
                          setShowDeletionConfirmation(true);
                          HandleDeletability(item.id);
                        }}
                        alt="Delete Lane"
                        whileHover={{ scale: 1.5 }}
                        src="/svg/delete.svg"
                      ></motion.img>
                    ) : (
                      <img
                        {...(item.default
                          ? {
                              title:
                                "Default Lane cannot be deleted but can be disabled",
                            }
                          : null)}
                        className="disabled"
                        alt="Add New Card"
                        src="/svg/delete_inactive.svg"
                      ></img>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    );
  }
  return null;
};

export default LaneSettingsModal;
