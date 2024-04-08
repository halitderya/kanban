import React, { ChangeEvent, useEffect, useState } from "react";
import ThemeSwitch from "@/theme/themechanger";
import SearchIcon from "./iconcomponents/searchicon";
import SettingsIcon from "./iconcomponents/settingsicon";
import ProfileIcon from "./iconcomponents/profileicon";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { setSearch } from "@/features/search/searchSlice";

const Header = (props: {
  setshowLaneSettingsModal: any;
  showLaneSettingsModal: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  function handleSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    dispatch(setSearch(debouncedSearchTerm));
  }, [debouncedSearchTerm]);

  return (
    <div className=" header flex justify-between cursor-pointer items-center mb-4 w-full shadow-xl gap-x-8 ">
      <div className=" h-full hidden md:flex icondiv w-64   max-w-xl mb-2  dark:border-green-500   dark:bg-gray-600  flex-row bg-gray-100 rounded-md flex-shrink-0  flex-grow mx-1 items-center border-4 border-solid ">
        <SearchIcon></SearchIcon>
        <input
          onChange={(e) => {
            handleSearchTerm(e);
          }}
          className=" placeholder:dark:text-gray-100 w-full text-lg  dark:bg-gray-600 bg-gray-100 rounded-md p-2  cursor-text focus:outline-none width-96 "
          placeholder="Search Cards"
        ></input>
      </div>
      <div className=" w-96   text-center h-full text-nowrap flex-shrink content-center ">
        Kanban Board
      </div>
      <div className="flex w-52  flex-row items-center flex-shrink-0 flex-grow sm:flex-grow-0 justify-around  ">
        <div
          onClick={() => {
            props.setshowLaneSettingsModal(true);
          }}
        >
          <SettingsIcon></SettingsIcon>
        </div>
        <div className=" ml-4">
          <ProfileIcon></ProfileIcon>
        </div>
        <div className="">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default Header;
