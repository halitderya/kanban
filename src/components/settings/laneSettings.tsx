"use client";
import React, { useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Reorder, motion, useDragControls } from "framer-motion";
import {
  fetchCardDataThunk,
  populateAllCardsThunk,
  removeAllCardsThunk,
  updateCard,
  updateCardDataThunk,
} from "@/features/card/cardSlice";
import { selectCard } from "@/features/card/selectedCardSlice";
import { current } from "@reduxjs/toolkit";
import { Lane } from "@/types/linetype";
import {
  addNewLaneThunk,
  deleteSingleLaneThunk,
  fetchLaneDataThunk,
  populateDefaultLanesThunk,
  updateLaneDataThunk,
} from "@/features/lane/laneSlice";
import DragIcon from "../iconcomponents/dragicon";

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

  // useEffect(() => {
  //   dispatch(fetchLaneDataThunk());
  // }, [items]);

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
  ///immigrant functions
  function addDummyCards(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    dispatch(populateAllCardsThunk()).then(() => {
      dispatch(fetchCardDataThunk());
    });
  }

  function addDefaultLanes(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    dispatch(populateDefaultLanesThunk()).then(() => {
      dispatch(fetchLaneDataThunk());
    });
  }
  function deleteAllCards(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    dispatch(removeAllCardsThunk()).then(() => {
      dispatch(fetchCardDataThunk());
    });
  }

  ///

  function LaneActiveChanged(lane: Lane) {
    const updatedlane: Lane = {
      ...lane,
      active: !lane.active,
    };

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === lane.id ? updatedlane : item))
    );
    dispatch(updateLaneDataThunk(updatedlane)).then(() => {
      dispatch(fetchLaneDataThunk());
    });
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
        className=" bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center z-[1000]  "
        onClick={(e) => handleoutsideclick(e)}
      >
        {showDeletionConfirmation && (
          <div className="addlanemodal ">
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
            className="addlanemodal"
          >
            <h2 className="block mb-6 text-lg font-medium ">Add new lane</h2>
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
          className="modalwindow dark:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setShowAddLaneModal(false);
            setShowDeletionConfirmation(false);
          }}
        >
          <fieldset className="section-box">
            <legend className="">Lane Settings</legend>
            <div className="flex dark:bg-gray-600 flex-row w-full justify-between mb-2 flex-shrink-1">
              <button
                className="settings-button w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddLaneModal(true);
                }}
              >
                {" "}
                Add New Lane
              </button>
            </div>

            <Reorder.Group
              className="w-full dark:bg-gray-600"
              axis="y"
              values={items}
              onReorder={handleReorder}
            >
              {items.map((item) => (
                <Reorder.Item key={item.id} value={item}>
                  <div className="cardmain flex flex-row my-2 items-center w-full justify-between dark:bg-gray-600">
                    <DragIcon />
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
          </fieldset>
          <fieldset className=" section-box">
            <legend>Default Settings</legend>
            <button className=" settings-button" onClick={addDefaultLanes}>
              Reset to default lanes
            </button>
            <button className=" settings-button" onClick={deleteAllCards}>
              Delete all cards
            </button>
            <button className=" settings-button" onClick={addDummyCards}>
              Add 5 dummy cards
            </button>
          </fieldset>
        </div>
      </div>
    );
  }

  return null;
};

export default LaneSettingsModal;
