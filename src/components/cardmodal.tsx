"use client";
import React, { useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { motion } from "framer-motion";
import {
  addCardThunk,
  fetchCardDataThunk,
  updateCardDataThunk,
} from "@/features/card/cardSlice";
import { selectCard } from "@/features/card/selectedCardSlice";
import { Lane } from "@/types/linetype";
import { capitalizeFirstLetters } from "@/utils/capitalizefirstletter";

const CardModal = (props: {
  setShowModal: any;
  showModal: any;
  lane: Lane;
}) => {
  const selectedCardData = useSelector(
    (state: RootState) => state.selectedcard
  );
  const selectedCard = selectedCardData.selectedCard || null;

  const dispatch = useDispatch<AppDispatch>();
  const [cardName, setCardName] = useState<string>("");
  const [cardDesc, setCardDesc] = useState<string>("");
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
    dispatch(fetchCardDataThunk());
  }
  function handleSaveNewCard(e: React.SyntheticEvent): void {
    e.preventDefault();
    const newCard = {
      name: cardName,
      description: cardDesc,
      created: Date.now().toString(),
      archived: false,
      owner: "owner1",
      lane: props.lane.id,
    };

    dispatch(addCardThunk(newCard as Card))
      .then((response) => {
        console.log("response: ", response);
        // Başarılı ekleme işlemi sonrası gereken işlemler burada yapılabilir.
      })
      .then(() => {
        setCardName("");
        setCardDesc("");
        handleoutsideclick(); // Modal'ı kapat ve gerekli temizlik işlemlerini yap.
      });
  }

  async function savecard(e?: React.SyntheticEvent) {
    if (selectedCard) {
      const updated = {
        ...(selectedCard as Card),
        description:
          cardAsState?.description !== undefined
            ? cardAsState?.description
            : "",
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
    }

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
    setCardAsState((current) => {
      if (!current) return null;

      const updatedState = { ...current, archived: !current.archived };

      return updatedState;
    });
    savecard();
  }

  function handleNewCardFieldUpdate(e: React.SyntheticEvent) {
    switch (((e as React.SyntheticEvent).target as HTMLInputElement).id) {
      case "name":
        setCardName((e.target as HTMLInputElement).value);

        break;

      case "description":
        setCardDesc((e.target as HTMLInputElement).value);
        break;
    }
  }
  function handlecardupdate(e: React.SyntheticEvent) {
    e.preventDefault();
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
    checked: { backgroundColor: "#22c55e" },
    unchecked: { backgroundColor: "#d25555" },
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
          <form
            className="modalwindow  "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="firstrow w-full text-xl flex mb-6 justify-center flex-col  items-start font-bold">
              <div className="">
                {selectedCard ? (
                  <h2>
                    Editing Card :{" "}
                    {selectedCard.name.length > 10
                      ? `${capitalizeFirstLetters(
                          selectedCard.name.slice(0, 10)
                        )}...`
                      : capitalizeFirstLetters(selectedCard.name)}
                  </h2>
                ) : (
                  <h2>Create Card</h2>
                )}
              </div>
            </div>
            <fieldset className="section-box flex flex-col gap-6 ">
              <legend className=" text-md font-light">Card Details</legend>
              <div className="flex flex-row  ">
                {/* birinci bura */}
                <div className="firstrow flex flex-row w-full justify-between items-center">
                  {selectedCard ? (
                    <input
                      id="name"
                      type="text"
                      value={cardAsState?.name}
                      onChange={(e) => {
                        handlecardupdate(e);
                      }}
                      className=" forminput "
                    ></input>
                  ) : (
                    <input
                      id="name"
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        handleNewCardFieldUpdate(e);
                      }}
                      className=" forminput "
                    ></input>
                  )}
                  {/* toggle buraya */}

                  {selectedCard ? (
                    <motion.div whileHover={{ scale: 1.1 }} className="">
                      <motion.div
                        animate={
                          !cardAsState?.archived ? "checked" : "unchecked"
                        }
                        className="relative w-16 h-8 flex items-center flex-shrink-0 ml-4 p-1 rounded-full   cursor-pointer z-50"
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
                  ) : null}
                </div>
                {/* toggle bitti */}
              </div>

              {/* ikinci buraya */}
              {selectedCard ? (
                <textarea
                  id="description"
                  placeholder="Description"
                  className="forminput  "
                  value={cardAsState?.description}
                  onChange={(e) => {
                    handlecardupdate(e);
                  }}
                  // type="text"
                ></textarea>
              ) : (
                <input
                  id="description"
                  placeholder="Description"
                  className="forminput  "
                  value={cardDesc}
                  onChange={(e) => {
                    handleNewCardFieldUpdate(e);
                  }}
                  type="text"
                ></input>
              )}
            </fieldset>

            {selectedCard && cardAsState?.comments !== undefined ? (
              <fieldset className="section-box flex flex-col gap-4  dark:bg-gray-600 dark:shadow-sm dark:shadow-gray-100">
                <legend className="text-md font-light">Comments</legend>
                {cardAsState?.comments.map((c, index) => (
                  <div key={index} className="flex flex-col">
                    <input
                      className="forminput "
                      id={`comment-${index}`}
                      disabled
                      type="text"
                      value={c.comment}
                      onChange={(e) => {
                        handlecardupdate(e);
                      }}
                    />
                    <div className="text-xs font-thin self-end">{c.date}</div>
                  </div>
                ))}
              </fieldset>
            ) : null}

            {selectedCard ? (
              <input
                placeholder="Add comment"
                value={newComment?.comment}
                onChange={(e) => {
                  setNewComment({
                    comment: e.target.value,
                    date: formatDateTime(),
                  } as CommentType);
                }}
                className="forminput  "
              ></input>
            ) : null}
            {!selectedCard ? (
              <button
                id="savebutton"
                type="submit"
                disabled={cardName === "" ? true : false}
                className="settings-button  "
                onClick={(e) => {
                  handleSaveNewCard(e);
                }}
              >
                Save
              </button>
            ) : (
              <button
                id="addcomment"
                type="submit"
                disabled={newComment?.comment === "" ? true : false}
                className=" settings-button "
                onClick={(e) => {
                  handlecardupdate(e);
                }}
              >
                Add Comment
              </button>
            )}
          </form>
        </div>
      </>
    );
  }
  return;
};

export default CardModal;
