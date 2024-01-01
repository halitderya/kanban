import React from "react";
import { CiSearch } from "react-icons/ci";

const Header = () => {
  return (
    <div className="flex mx-2  cursor-pointer items-center mb-4 rounded-md h-12 shadow-xl gap-x-8 ">
      <div className="flex justify-center content-center min-w-16 grow-0 h-full items-center hover:rounded-md hover:bg-gray-200">
        One
      </div>
      <div className="flex grow   ">
        <CiSearch size={25} />

        <input
          className="w-full focus:outline-none  "
          placeholder="Search Here"
        ></input>
      </div>
      <div className="flex grow-0 hover:bg-gray-200">Link1</div>
      <div className="flex grow-0 hover:bg-gray-200">Link2</div>
      <div className="flex grow-0 hover:bg-gray-200">Profile</div>
    </div>
  );
};

export default Header;
