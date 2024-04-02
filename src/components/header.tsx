import React from "react";
import ThemeSwitch from "@/theme/themechanger";

import {} from "@/theme/themechanger";
import SearchIcon from "./iconcomponents/searchicon";

const Header = (props: {
  setshowLaneSettingsModal: any;
  showLaneSettingsModal: any;
}) => {
  return (
    <div className=" border-test header flex cursor-pointer items-center mb-4 w-full shadow-xl gap-x-8 ">
      <div className="icondiv  dark:border-gray-200 border-solid border-4 dark:bg-gray-400 flex flex-row  bg-gray-100 rounded-md flex-shrink-0 flex-grow mx-2 items-center ">
        {/* <img className=" fill-red-700" src="/svg/search.svg"></img>  */}

        <SearchIcon></SearchIcon>
        <input
          className=" placeholder:dark:text-gray-300 dark:bg-gray-400 bg-gray-100 rounded-md p-2 cursor-text focus:outline-none flex-grow-1 w-full"
          placeholder="Search Here"
        ></input>
      </div>

      <div
        onClick={() => {
          props.setshowLaneSettingsModal(true);
        }}
        className="topbarmenuicons "
      >
        Settings
      </div>
      <div className="topbarmenuicons">Profile</div>
      <ThemeSwitch />
    </div>
  );
};

export default Header;
