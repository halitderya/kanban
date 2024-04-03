import React from "react";
import ThemeSwitch from "@/theme/themechanger";

import {} from "@/theme/themechanger";
import SearchIcon from "./iconcomponents/searchicon";
import SettingsIcon from "./iconcomponents/settingsicon";
import ProfileIcon from "./iconcomponents/profileicon";

const Header = (props: {
  setshowLaneSettingsModal: any;
  showLaneSettingsModal: any;
}) => {
  return (
    <div className=" header flex justify-between cursor-pointer items-center mb-4 w-full shadow-xl gap-x-8 ">
      <div className=" h-full hidden md:flex icondiv w-64   max-w-xl mb-2  dark:border-gray-200  dark:bg-gray-400  flex-row bg-gray-100 rounded-md flex-shrink-0  flex-grow mx-1 items-center border-2 border-solid ">
        <SearchIcon></SearchIcon>
        <input
          className=" placeholder:dark:text-gray-300 w-full text-lg  dark:bg-gray-400 bg-gray-100 rounded-md p-2  cursor-text focus:outline-none width-96 "
          placeholder="Search Here"
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
