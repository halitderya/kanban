"use client";
import React, { useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { motion } from "framer-motion";
import { updateCard, updateCardDataThunk } from "@/features/card/cardSlice";
import { selectCard } from "@/features/card/selectedCardSlice";
import { current } from "@reduxjs/toolkit";

const CardModal = (props: { setShowModal: any; showModal: any }) => {
  const selectedCardData = useSelector(
    (state: RootState) => state.selectedcard
  );
  const selectedCard = selectedCardData.selectedCard || null;
  const dispatch = useDispatch<AppDispatch>();
  const [cardAsState, setCardAsState] = useState<Card | null>(null);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<CommentType | null>({
    comment: "",
    date: "",
  });

  useEffect(() => {
    setCardAsState(selectedCard);
  }, [selectedCard]);

  useEffect(() => {
    savecard();
  }, [cardAsState]);

  function handleoutsideclick() {
    props.setShowModal(false);
    setFirstLoad(true);

    dispatch(selectCard(null));
  }
  async function savecard() {
    if (!selectedCard) return;

    const updated = {
      ...(selectedCard as Card),
      description:
        cardAsState?.description !== undefined ? cardAsState?.description : "",
      comments:
        cardAsState?.comments !== undefined
          ? cardAsState?.comments
          : new Array<CommentType>(),
      archived: cardAsState?.archived,
      lane: cardAsState?.lane,
      name: cardAsState?.name,
    };

    //we want to aviod run dispatch if the card is empty
    !firstLoad ? dispatch(updateCardDataThunk(updated as Card)) : null;

    setFirstLoad(false);
  }

  function formatDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  }

  async function cardArchivedChanged() {
    console.log(formatDateTime());

    setCardAsState((current) => {
      if (!current) return null;

      const updatedState = { ...current, archived: !current.archived };

      return updatedState;
    });
    savecard();
  }

  function handlecardupdate(e: React.SyntheticEvent) {
    switch (((e as React.SyntheticEvent).target as HTMLInputElement).id) {
      case "description":
        setCardAsState((current) =>
          current
            ? {
                ...current,
                description: (
                  (e as React.SyntheticEvent).target as HTMLInputElement
                ).value,
              }
            : null
        );
        break;
      case "addcomment":
        if (!cardAsState || !newComment) return;

        const newComments: CommentType[] = cardAsState.comments
          ? [...cardAsState.comments, newComment]
          : [newComment];

        setCardAsState((current) =>
          current ? { ...current, comments: newComments } : null
        );

        setNewComment({ comment: "", date: "" });
        const scr = document.scrollingElement;
        break;
      case "name":
        setCardAsState((current) =>
          current
            ? {
                ...current,
                name: ((e as React.SyntheticEvent).target as HTMLInputElement)
                  .value,
              }
            : null
        );
        break;
    }
  }
  const sliderVariants = {
    checked: { x: 24 },
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
            className="modalwindow shadow-xl p-6 overflow-y-auto overflow-x-hidden flex-grow-0 shadow-gray-400 w-auto hover:bg-slate-200 laneitem bg-slate-200  h-auto
             font-sans justify-between flex-col flex  max-w-[400px] min-w-[300px] min-h-52 max-h-[600px] border-solid border-4 rounded-lg border-gray-400  z-1000"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="firstrow w-full flex mb-6 justify-center items-center">
              <input
                id="name"
                type="text"
                value={cardAsState?.name || ""}
                onChange={(e) => {
                  handlecardupdate(e);
                }}
                className="rounded-sm bg-transparent font-bold focus:outline-none"
              ></input>

              {/* toggle buraya */}
              <motion.div whileHover={{ scale: 1.1 }} className="">
                <motion.div
                  animate={cardAsState?.archived ? "checked" : "unchecked"}
                  className="relative w-16 h-8 flex items-center flex-shrink-0 ml-4 p-1 rounded-full  cursor-pointer z-50"
                  variants={backgroundVariants}
                  onTap={cardArchivedChanged}
                >
                  <motion.span
                    className="w-8 h-6 bg-white rounded-full shadow-md flex justify-center items-center"
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
            </div>
            <input
              id="description"
              className="bg-slate-100 text-wrap w-full mb-4 "
              value={cardAsState?.description || ""}
              onChange={(e) => {
                handlecardupdate(e);
              }}
              type="text"
            ></input>

            <br />

            {cardAsState?.comments !== undefined
              ? cardAsState?.comments.map((c, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-none border-sm border-gray-500 rounded-xl border-2 w-full p-2 m-2"
                  >
                    <input
                      className="commentbubble flex-wrap font-sans text-m text-wrap bg-transparent"
                      key={index}
                      id="comment"
                      data-key={index}
                      disabled
                      type="text"
                      onChange={(e) => {
                        handlecardupdate(e);
                      }}
                      value={c.comment}
                    ></input>
                    <div className="text-xs mt-2 font-thin self-end ">
                      {c.date}
                    </div>
                  </div>
                ))
              : null}

            <input
              value={newComment?.comment}
              onChange={(e) => {
                setNewComment({
                  comment: e.target.value,
                  date: formatDateTime(),
                } as CommentType);
              }}
              className="flex flex-col border-sm border-gray-500 border-2 w-full p-2 m-2"
            ></input>

            <button
              id="addcomment"
              className=" border-4 border-solid border-orange-400"
              onClick={(e) => {
                handlecardupdate(e);
              }}
            >
              Click me
            </button>

            {/* 
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
