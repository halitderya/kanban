"use client";
import React, { useEffect, useState } from "react";
import { Card, Comment } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { motion } from "framer-motion";
import { updateCard, updateCardDataThunk } from "@/features/card/cardSlice";

const CardModal = (props: { setShowModal: any; showModal: any }) => {
  const selectedCardData = useSelector(
    (state: RootState) => state.selectedcard
  );
  const selectedCard = selectedCardData.selectedCard || null;
  const dispatch = useDispatch<AppDispatch>();

  const [cardDesc, setCardDesc] = useState<string>();
  const [cardName, setCardName] = useState<string>();
  const [cardComments, setCardComments] = useState<Comment[]>();

  useEffect(() => {
    setCardDesc(selectedCard?.description || "");
    setCardComments(selectedCard?.comments);
  }, [selectedCard]);

  function handleoutsideclick() {
    props.setShowModal(false);
  }
  function savecard() {
    if (!selectedCard || cardDesc === undefined) return;

    const updated = {
      ...(selectedCard as Card),
      description: cardDesc,
      comments: cardComments,
    };

    dispatch(updateCardDataThunk(updated)).then((action) => {
      console.log(action.type);
    });
    handleoutsideclick();
  }
  if (props.showModal) {
    return (
      <>
        <div
          className="bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center z-40"
          onClick={() => {
            handleoutsideclick();
          }}
        >
          <motion.form
            drag
            whileDrag={{ scale: 1.2 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            dragElastic={0.0}
            dragMomentum={false}
            className="modalwindow shadow-xl shadow-gray-400 hover:bg-slate-200 laneitem bg-slate-200 h-96 max-h-3/4 font-sans justify-between flex-col flex max-w-64  min-w-96 min-h-52 max-h-3/4 border-solid border-4 rounded-lg border-gray-400  z-1000"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className=" font-extrabold text-xl ">{selectedCard?.name}</div>
            <input
              value={cardDesc}
              onChange={(e) => setCardDesc(e.target.value)}
              type="text"
            ></input>

            <br />

            {cardComments?.map((c, index) => (
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
              onClick={savecard}
            >
              Add comment{" "}
            </button>

            <button
              className="border-sm p-4 shadow-md shadow-gray-400 rounded-md w-24 my-4 text-l font-bold border-4 hover:shadow-md hover:shadow-green-200"
              type="submit"
              onClick={savecard}
            >
              Save
            </button>
          </motion.form>
        </div>
      </>
    );
  }
  return;
};

export default CardModal;
