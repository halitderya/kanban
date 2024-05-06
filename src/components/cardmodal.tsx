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
import formatDateTime from "@/utils/date";
import { apiPostRequestHandler } from "@/utils/APIRequests";

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
  //const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<CommentType | null>({
    comment: "",
    date: "",
  });

  useEffect(() => {
    setCardAsState(selectedCard);
  }, [selectedCard]);

  async function handleoutsideclick(e: React.SyntheticEvent) {
    if (cardAsState) {
      // means updating an existing card
      if (
        cardAsState?.name !== selectedCard?.name ||
        cardAsState.description !== selectedCard.description ||
        cardAsState.archived !== selectedCard.archived
      ) {
        // something changed,card to be updated.
        cardAsState.name !== "" &&
          (await handlesaveExistingCard("handleoutsideclick"));
      }
    }
    // wrap things up

    props.setShowModal(false);
    await dispatch(selectCard(null));
    await dispatch(fetchCardDataThunk());
  }

  async function handleSaveNewCard(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    const newCard = {
      name: cardName,
      description: cardDesc,
      created: Date.now().toString(),
      archived: false,
      owner: "Demo user",
      lane: props.lane.id,
    };

    await dispatch(addCardThunk(newCard as Card))
      .then(() => {
        setCardName("");
        setCardDesc("");
      })

      .then(() => {
        handleoutsideclick(e);
      });
  }

  async function handleAddCommentCard(e: React.SyntheticEvent) {
    e.preventDefault();

    // Yeni yorumun geçerli olup olmadığını kontrol edin
    if (newComment && newComment.comment.trim() !== "") {
      const payload = {
        id: cardAsState?.id,
        comments: newComment.comment,
      };

      try {
        const response = await apiPostRequestHandler(
          "/cards/addComment",
          payload
        );

        if (response) {
          setCardAsState((previousState) => {
            if (previousState === null) return null;
            return {
              ...previousState,
              comments: [...(previousState.comments || []), newComment],
            };
          });

          setNewComment({ comment: "", date: "" });
        } else {
          console.error(
            "Failed to add comment due to API error or invalid response"
          );
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  }

  async function handlesaveExistingCard(source?: string) {
    if (selectedCard) {
      const updated = {
        ...(selectedCard as Card),
        description:
          cardAsState?.description !== undefined
            ? cardAsState?.description
            : "",

        archived: cardAsState?.archived,
        lane: cardAsState?.lane,
        name: cardAsState?.name,
      };
      source === "handleoutsideclick" &&
        (await dispatch(updateCardDataThunk(updated as Card)));
    }
  }

  async function cardArchivedChanged() {
    setCardAsState((current) => {
      if (!current) return null;

      const updatedState = { ...current, archived: !current.archived };

      return updatedState;
    });
    handlesaveExistingCard();
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
  function handleExistingCardUpdate(e: React.SyntheticEvent) {
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
        {/* outer transparent div */}
        <div
          className="bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center z-40"
          onClick={(e) => {
            handleoutsideclick(e);
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
                {cardAsState ? (
                  <h2>
                    Editing Card :{" "}
                    {cardAsState.name.length > 10
                      ? `${capitalizeFirstLetters(
                          cardAsState.name.slice(0, 10)
                        )}...`
                      : capitalizeFirstLetters(cardAsState.name)}
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
                  {cardAsState ? (
                    <input
                      id="name"
                      autoComplete="off"
                      value={cardAsState?.name}
                      onChange={(e) => {
                        handleExistingCardUpdate(e);
                      }}
                      className=" forminput "
                    ></input>
                  ) : (
                    <input
                      id="name"
                      autoComplete="off"
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        handleNewCardFieldUpdate(e);
                      }}
                      className=" forminput "
                    ></input>
                  )}
                  {/* toggle buraya */}

                  {cardAsState ? (
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
                  autoComplete="off"
                  value={cardAsState?.description}
                  onChange={(e) => {
                    handleExistingCardUpdate(e);
                  }}
                  // type="text"
                ></textarea>
              ) : (
                <input
                  id="description"
                  placeholder="Description"
                  autoComplete="off"
                  className="forminput  "
                  value={cardDesc}
                  onChange={(e) => {
                    handleNewCardFieldUpdate(e);
                  }}
                  type="text"
                ></input>
              )}
            </fieldset>

            {selectedCard &&
            cardAsState?.comments !== undefined &&
            cardAsState.comments.length > 0 ? (
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
                        handleExistingCardUpdate(e);
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
                autoComplete="off"
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
                  handleAddCommentCard(e);
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
