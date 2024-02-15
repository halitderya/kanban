import { CiSearch } from "react-icons/ci";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

import {
  fetchCardDataThunk,
  populateAllCardsThunk,
} from "@/features/card/cardSlice";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  function addDummyCards(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    dispatch(populateAllCardsThunk()).then(() => {
      dispatch(fetchCardDataThunk());
    });
  }

  return (
    <div className="flex cursor-pointer items-center mb-4 h-12 shadow-xl gap-x-8 ">
      <div className="topbarmenuicons">One</div>
      <div className="flex grow   ">
        <CiSearch size={25} />

        <input
          className="w-full focus:outline-none  "
          placeholder="Search Here"
        ></input>
      </div>
      <div onClick={addDummyCards} className="topbarmenuicons">
        Add 5 Dummy Cards
      </div>
      <div className="topbarmenuicons">Link1</div>
      <div className="topbarmenuicons">Link2</div>
      <div className="topbarmenuicons">Profile</div>
    </div>
  );
};

export default Header;
