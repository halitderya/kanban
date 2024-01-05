import React from "react";
import { CiSearch } from "react-icons/ci";

const Header = () => {
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
      <div className="topbarmenuicons">Link1</div>
      <div className="topbarmenuicons">Link2</div>
      <div className="topbarmenuicons">Profile</div>
    </div>
  );
};

export default Header;
