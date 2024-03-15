"use client";
import React, { useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { motion } from "framer-motion";
import { updateCard, updateCardDataThunk } from "@/features/card/cardSlice";
import { selectCard } from "@/features/card/selectedCardSlice";

const CardModal = (props: { setShowModal: any; showModal: any }) => {
  const selectedCardData = useSelector(
    (state: RootState) => state.selectedcard
  );
  const selectedCard = selectedCardData.selectedCard || null;
  const dispatch = useDispatch<AppDispatch>();
  const [cardAsState, setCardAsState] = useState<Card | null>(null);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    setCardAsState(selectedCard);
    //  console.log("cardasstate:", cardAsState, "selectedcard", selectedCard);
  }, [selectedCard]);

  useEffect(() => {
    savecard();
  }, [cardAsState]);

  function handleoutsideclick() {
    props.setShowModal(false);

    dispatch(selectCard(null));
  }
  async function savecard() {
    if (!selectedCard) return;

    const updated = {
      ...(selectedCard as Card),
      description: cardAsState?.description,
      comments: cardAsState?.comments,
      archived: cardAsState?.archived,
      lane: cardAsState?.lane,
      lane_was: cardAsState?.lane_was,
    };
    console.log("updated", updated);

    !firstLoad ? dispatch(updateCardDataThunk(updated as Card)) : null;
    setFirstLoad(false);

    //handleoutsideclick();
  }

  // function addcomment() {
  //   const newcomment: CommentType = { comment: "fdsfds", date: new Date() };
  //   setCardComments((prevComments) => [...(prevComments || []), newcomment]);
  // }

  async function cardArchivedChanged() {
    setCardAsState((current) => {
      if (!current) return null;

      const updatedState = { ...current, archived: !current.archived };

      if (!updatedState.archived) {
        // cardArchived false ise, lane_was ve lane'i güncelle
        return {
          ...updatedState,
          lane_was: updatedState.lane,
          lane: 8,
        };
      } else {
        // Eğer archived true ise, sadece archived'ı güncelle
        console.log("card not Archived");
        return updatedState;
      }
    });
  }

  const sliderVariants = {
    checked: { x: 40 },
    unchecked: { x: 0 },
  };

  const backgroundVariants = {
    unchecked: { backgroundColor: "#68D391" },
    checked: { backgroundColor: "#d25555" },
  };
  if (props.showModal) {
    return (
      <>
        <div
          className="bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center z-40"
          onClick={() => {
            handleoutsideclick();
          }}
        >
          <div
            className="modalwindow shadow-xl shadow-gray-400 hover:bg-slate-200 laneitem bg-slate-200 h-96 max-h-3/4 font-sans justify-between flex-col flex max-w-64  min-w-96 min-h-52 max-h-3/4 border-solid border-4 rounded-lg border-gray-400  z-1000"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className=" font-extrabold text-xl mb-4 ">
              {selectedCard?.name}
            </div>
            {/* toggle buraya */}
            <motion.div whileHover={{ scale: 1.1 }} className="p-2 text-xl">
              <motion.div
                animate={cardAsState?.archived ? "checked" : "unchecked"}
                className="relative w-24 h-10 flex items-center flex-shrink-0 ml-4 p-1 rounded-full  cursor-pointer z-50"
                variants={backgroundVariants}
                onTap={cardArchivedChanged}
              >
                <motion.span
                  className="w-12 h-8 bg-white rounded-full shadow-md flex justify-center items-center"
                  layout
                  variants={sliderVariants}
                >
                  {cardAsState?.archived ? (
                    <motion.img
                      src="/svg/archive.svg"
                      className="w-4 h-4 z-40"
                      animate="unchecked"
                    />
                  ) : null}
                </motion.span>
              </motion.div>
            </motion.div>

            {/* toggle bitti */}

            <input
              value={cardAsState?.description || ""}
              onChange={(e) =>
                setCardAsState((current) =>
                  current ? { ...current, description: e.target.value } : null
                )
              }
              type="text"
            ></input>

            <br />

            {/* {cardAsState?.comments?.map((c, index) => (
              <div
                key={index}
                className="flex flex-col border-sm border-gray-500 border-2 w-full p-2 m-2"
              >
                <input
                  type="text"
                  onChange={(e) => {
                    const updatedComments = [...cardComments];
                    updatedComments[index] = { ...c, comment: e.target.value };
                    setCardComments(updatedComments);
                  }}
                  value={c.comment}
                ></input>
                <div className="text-xs font-thin self-end ">
                  {c.date.toString()}
                </div>
              </div>
            ))}

            <button
              className="border-sm p-4 shadow-md shadow-gray-400 rounded-md w-24 my-4 text-l font-bold border-4 hover:shadow-md hover:shadow-green-200"
              type="submit"
              onClick={addcomment}
            >
              Add comment{" "}
            </button> */}

            {/* <button
              className="border-sm p-4 shadow-md shadow-gray-400 rounded-md w-24 my-4 text-l font-bold border-4 hover:shadow-md hover:shadow-green-200"
              type="submit"
              onClick={() => {
                savecard();
                handleoutsideclick();
              }}
            >
              Save
            </button> */}
          </div>
        </div>
      </>
    );
  }
  return;
};

export default CardModal;
