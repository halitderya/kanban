import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, CommentType } from "@/types/cardtype";
import { useDispatch, useSelector } from "react-redux";
import {
  addCardThunk,
  fetchCardDataThunk,
  updateCardDataThunk,
} from "@/features/card/cardSlice";
import { capitalizeFirstLetters } from "@/utils/capitalizefirstletter";
import UnarchivedIcon from "@/components/iconcomponents/unarchivedicon";
import { AppDispatch, RootState } from "@/app/store";
import { AnimatePresence, motion } from "framer-motion";
const sliderVariants = {
  checked: { x: 24 },
  unchecked: { x: 0 },
};
const backgroundVariants = {
  checked: { backgroundColor: "#22c55e" },
  unchecked: { backgroundColor: "#d25555" },
};

export const ArchivedModal = (props: {
  showArchivedModal: boolean;
  setShowArchivedModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const cardsData: { [key: string]: Card } | null = useSelector(
    (state: RootState) => state.carddata.data
  );

  if (cardsData) {
    Object.values(cardsData)
      .filter((f) => f.archived)
      .map((c) => {});
  }
  const cardExitVariants = {
    hidden: { opacity: 0, scale: 0.75, transition: { duration: 0.5 } },
  };
  useEffect(() => {}, []);
  async function cardArchivedChanged(c: Card) {
    const updated = { ...c, archived: !c.archived };
    console.log(updated);

    dispatch(updateCardDataThunk(updated as Card));
  }
  return (
    <div
      className=" bg-transparent backdrop-blur-sm w-full h-full fixed flex items-center justify-center z-[1000]  "
      onClick={(e) => {
        props.setShowArchivedModal(false);
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalwindow  "
      >
        <div className="flex flex-wrap ">
          <AnimatePresence>
            {cardsData &&
              Object.values(cardsData)
                .filter((f) => f.archived)
                .map((c, i) => {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit="hidden"
                      variants={cardExitVariants}
                      className="w- h-16 p-4 m-4 flex gap-4  items-center justify-between dark:bg-gray-900 bg-neutral-300 rounded-lg"
                    >
                      <div className=" text-gray-600 dark:text-gray-100 ">
                        {c.name.length > 20
                          ? `${capitalizeFirstLetters(c.name.slice(0, 20))}...`
                          : capitalizeFirstLetters(c.name)}
                      </div>

                      <div className="relative">
                        <input
                          id="checkbox"
                          type="checkbox"
                          checked={c.archived}
                          onChange={() => cardArchivedChanged(c)}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor="checkbox"
                          className="inline-flex  justify-center items-center ml-4bg-neutral-300rounded cursor-pointer w-auto transition-colors duration-200 ease-in-out"
                        >
                          <UnarchivedIcon />
                        </label>
                      </div>
                    </motion.div>
                  );
                })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
