import React, { ChangeEvent, useEffect, useState } from "react";
import ThemeSwitch from "@/theme/themechanger";
import SearchIcon from "./iconcomponents/searchicon";
import SettingsIcon from "./iconcomponents/settingsicon";
import ProfileIcon from "./iconcomponents/profileicon";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { setSearch } from "@/features/search/searchSlice";
import ArchivedIcon from "./iconcomponents/archivedicon";

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
    <div className=" header flex justify-between center cursor-pointer p-2 items-center mb-4 w-full rounded-lg gap-x-8 border-solid dark:bg-gray-600 shadow-md shadow-neutral-300 drop-shadow-md">
      <div className="  h-full flex max-md:hidden border-2 w-64 max-w-xl dark:border-gray-100 dark:border-opacity-40     dark:bg-gray-600  flex-row bg-zinc-50 rounded-md flex-shrink-0  flex-grow  items-center  ">
        <SearchIcon></SearchIcon>
        <input
          onChange={(e) => {
            handleSearchTerm(e);
          }}
          className=" placeholder:dark:text-gray-100 w-full text-lg  dark:bg-gray-600 bg-zinc-50 rounded-md  cursor-text focus:outline-none  "
          placeholder="Search Cards"
        ></input>
      </div>
      <div className=" w-auto  text-lg text-center self-start    h-full text-nowrap flex-shrink content-center ">
        Kanban Board
      </div>
      <div className="flex w-auto  flex-row items-center flex-shrink-0 flex-grow-0 justify-between  box-content overflow-hidden max-sm:gap-1 gap-4 ">
        <div
          className=""
          onClick={() => {
            props.setshowLaneSettingsModal(true);
          }}
        >
          <ArchivedIcon></ArchivedIcon>
        </div>
        <div
          className=""
          onClick={() => {
            props.setshowLaneSettingsModal(true);
          }}
        >
          <SettingsIcon></SettingsIcon>
        </div>
        <div className="">
          <ProfileIcon></ProfileIcon>
        </div>
        <div className="pr-4 max-sm:pr-0">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default Header;
