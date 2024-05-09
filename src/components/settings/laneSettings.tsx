"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { useTheme } from "next-themes";

import { Reorder, motion } from "framer-motion";
import {
  fetchCardDataThunk,
  populateAllCardsThunk,
  removeAllCardsThunk,
} from "@/features/card/cardSlice";

import { Lane } from "@/types/linetype";
import {
  addNewLaneThunk,
  deleteSingleLaneThunk,
  fetchLaneDataThunk,
  populateDefaultLanesThunk,
  updateLaneActiveThunk,
  updateLaneDataThunk,
} from "@/features/lane/laneSlice";
import DragIcon from "../iconcomponents/dragicon";
import useConfirm from "../../hooks/useConfirm";
import { apiDeleteRequestHandler } from "@/utils/APIRequests";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  setshowLaneSettingsModal: Dispatch<SetStateAction<boolean>>;
  showLaneSettingsModal: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  const lanedata: { [key: string]: Lane } | null = useSelector(
    (state: RootState) => state.lanedata.data
  );
  const laneArray = lanedata ? Object.values(lanedata) : [];

  const carddata: { [key: string]: Card } | null = useSelector(
    (state: RootState) => state.carddata.data
  );

  const [originalOrder, setOriginalOrder] = useState(laneArray);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showDeleteAllCardsDialog, setshowDeleteAllCardsDialog] =
    useState<boolean>(false);
  const [items, setItems] = useState(laneArray);
  const [showAddLaneModal, setShowAddLaneModal] = useState<boolean>(false);
  const [newLaneName, setNewLaneName] = useState<string>("");
  const [newLaneDesc, setNewLaneDesc] = useState<string>("");
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
  const [tbClasses, setTbClasses] = useState<string>("transparent-background");
  ///////////////////
  async function handleoutsideclick(e: React.SyntheticEvent) {
    if (showAddLaneModal) {
      setShowAddLaneModal(false);
      setTbClasses("transparent-background z-10");
    } else {
      props.setshowLaneSettingsModal(false);
      setTbClasses("transparent-background z-5");
    }

    if (items !== originalOrder) {
      if (originalOrder.length === items.length)
        await dispatch(updateLaneDataThunk(items));
    }
    dispatch(fetchLaneDataThunk());
  }
  /////////////////

  async function handleNewLaneAdded(e: React.SyntheticEvent) {
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
        _id: "",
        name: newLaneName,
        description: newLaneDesc,
        order: lastOrder,
        active: true,
        default: false,
      };

      await dispatch(addNewLaneThunk(newLane))
        .then((e) => {
          setItems((currentItems) => [...currentItems, e.meta.arg]);
          setOriginalOrder((currentItems) => [...currentItems, e.meta.arg]);
        })
        .then(() => {
          setTbClasses("transparent-background z-10");
        });
    } else {
      console.error("error 1204");
      return;
    }
    await dispatch(fetchLaneDataThunk());
  }
  async function HandleDeletability(id: number) {
    const cardArray = carddata ? Object.values(carddata) : [];
    const hasCards = cardArray.some((card) => card.lane === id);
    if (hasCards) {
      toast.error("Lane has cards, cannot delete.", {
        position: "top-right",
        theme: theme,
        autoClose: 2000,
      });
    } else {
      setShowDeleteDialog(true);
      const confirmed = await confirmDelete();
      setShowDeleteDialog(false);
      if (confirmed) {
        const tobedeleted = laneArray.find((l) => l.id === id)?.id.toString();

        if (tobedeleted !== undefined) {
          dispatch(deleteSingleLaneThunk(tobedeleted)).then((result) => {
            if (result.payload == 200) {
              dispatch(fetchLaneDataThunk()).then(() => {
                fetchCardDataThunk();
              });
              toast.success("Lane Deleted", {
                position: "top-right",
                theme: theme,
                autoClose: 2000,
              });
            }
          });
        }
      }
    }
  }

  const [DeleteConfirmationDialog, confirmDelete] = useConfirm(
    "Confirm Delete",
    "Are you sure you want to delete this lane?"
  );
  const [ResetConfirmationDialog, confirmReset] = useConfirm(
    "Confirm Reset",
    "Reset all lanes to default? This will also cause all cards to deleted!"
  );
  const [DeleteAllCardsDialog, confirmDeleteAllCards] = useConfirm(
    "Confirm Delete",
    "Are you sure you want to delete all cards?"
  );

  async function handleResetLanes() {
    setShowResetDialog(true);
    const confirmed = await confirmReset();
    setShowResetDialog(false);
    if (confirmed) {
      await dispatch(populateDefaultLanesThunk());
      dispatch(fetchLaneDataThunk()).then(() => {
        toast.success("Reset successful!", {
          theme: theme,
          autoClose: 2000,
        });
      });
    }
  }
  ///immigrant functions
  function addDummyCards(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    dispatch(populateAllCardsThunk()).then((res) => {
      if (res.meta.requestStatus == "fulfilled") {
        dispatch(fetchLaneDataThunk()).then(() => {
          dispatch(fetchCardDataThunk()).then(() => {
            toast.success("Dummy cards added", {
              theme: theme,
              autoClose: 2000,
            });
          });
        });
      }
    });
  }

  useEffect(() => {
    if (lanedata) {
      const updatedLaneArray = Object.values(lanedata);
      setItems(updatedLaneArray);
      setOriginalOrder(updatedLaneArray);
    }
  }, [lanedata]);

  async function deleteAllCards(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    setshowDeleteAllCardsDialog(true);
    const deleteAllCardsConfirmed = await confirmDeleteAllCards();
    setshowDeleteAllCardsDialog(false);
    if (deleteAllCardsConfirmed) {
      dispatch(removeAllCardsThunk()).then((res) => {
        if (res.meta.requestStatus == "fulfilled") {
          dispatch(fetchLaneDataThunk()).then(() => {
            dispatch(fetchCardDataThunk()).then(() => {
              toast.success("Cards deleted", {
                theme: theme,
                autoClose: 2000,
              });
            });
          });
        }
      });
    }
  }

  function LaneActiveChanged(lane: Lane) {
    const updatedlane: Lane = {
      ...lane,
      active: !lane.active,
    };

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === lane.id ? updatedlane : item))
    );
    dispatch(updateLaneActiveThunk(updatedlane)).then(() => {
      dispatch(fetchLaneDataThunk());
    });
  }

  function handleFormEnable(otherprop: string, e: React.SyntheticEvent) {
    if (otherprop !== "" && (e.target as HTMLInputElement).value !== "") {
      setSubmitEnabled(true);
    } else {
      setSubmitEnabled(false);
    }
  }

  // sorunlu fonksiyon
  function handleReorder(newOrder: Lane[]) {
    const updatedLanes = newOrder.map((lane, index) => ({
      ...lane,
      order: index,
    }));
    setItems(updatedLanes);
  }
  /////

  return (
    <>
      <div
        // this div is blurry background
        className={tbClasses}
        onClick={(e) => {
          handleoutsideclick(e);
          e.stopPropagation;
        }}
      >
        {" "}
      </div>
      <ToastContainer />
      {showDeleteDialog && <DeleteConfirmationDialog />}
      {}
      {showResetDialog && <ResetConfirmationDialog />}
      {showDeleteAllCardsDialog && <DeleteAllCardsDialog />}

      {/* ADD LANE MODAL STARTS HERE */}
      {showAddLaneModal ? (
        <div className="addlanemodal z-40">
          <h2 className="block mb-6 text-lg font-medium  ">Add new lane</h2>
          <form className="">
            <label className="forminputlabel" htmlFor="inputnewlanename">
              Lane Name
            </label>
            <input
              autoComplete="off"
              id="inputnewlanename"
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
              autoComplete="off"
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
              className=" settings-button w-full mt-4 "
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

      {/* ADD LANE MODAL ENDS HERE */}
      {/* SETTINGS MAIN MODAL STARTS HERE */}
      <div
        className="modalwindow z-20"
        onClick={(e) => {
          e.stopPropagation();
          setShowAddLaneModal(false);
        }}
      >
        <fieldset className="section-box">
          <legend className="">Lane Settings</legend>
          <div className="flex dark:bg-gray-600 flex-row w-full justify-between mb-2 flex-shrink-1 z-10 ">
            <button
              className="settings-button w-full"
              onClick={(e) => {
                e.stopPropagation();

                setShowAddLaneModal(true);

                setTbClasses("transparent-background z-30");
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
                <div className="cardmain flex flex-row my-2  items-center w-full justify-between dark:bg-gray-600">
                  <DragIcon />
                  <div className="flex-grow">{item.name}</div>
                  <div>
                    <div>
                      <motion.div
                        key={item.id}
                        animate={item.active ? "unchecked" : "checked"}
                        className="relative w-16 h-8 flex items-center flex-shrink-0 ml-4 p-1 rounded-full  cursor-pointer "
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

                  {
                    <div className="ml-2">
                      {!item.default ? (
                        <motion.img
                          id={item._id.toString()}
                          drag={false}
                          onTap={(e) => {
                            // setShowDeletionConfirmation(true);
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
                  }
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </fieldset>
        <fieldset className=" section-box">
          <legend>Default Settings</legend>
          <button
            className=" settings-button"
            onClick={() => handleResetLanes()}
          >
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
      {/* SETTINGS MAIN MODAL ENDS HERE */}
    </>
  );
};

export default LaneSettingsModal;
