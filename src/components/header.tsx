import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ThemeSwitch from "@/theme/themechanger";
import SearchIcon from "./iconcomponents/searchicon";
import SettingsIcon from "./iconcomponents/settingsicon";
import ProfileIcon from "./iconcomponents/profileicon";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { setSearch } from "@/features/search/searchSlice";
import ArchivedIcon from "./iconcomponents/archivedicon";
import { ArchivedModal } from "./archivedmodal";

const Header = (props: {
  setshowLaneSettingsModal: Dispatch<SetStateAction<boolean>>;
  showLaneSettingsModal: boolean;
  showArchivedModal: boolean;
  setShowArchivedModal: Dispatch<SetStateAction<boolean>>;
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
    <div className=" header flex justify-center min-[410px]:justify-between  z-[1] center cursor-pointer p-2 items-center mb-4 w-full rounded-lg gap-x-8 border-solid dark:bg-gray-600  shadow-neutral-300 drop-shadow-md">
      <div className="h-full flex max-md:hidden border-2 w-64 max-w-xl    dark:border-gray-100 dark:border-opacity-40     dark:bg-gray-600  flex-row bg-zinc-50 rounded-md flex-shrink-0  flex-grow  items-center  ">
        <SearchIcon></SearchIcon>
        <input
          onChange={(e) => {
            handleSearchTerm(e);
          }}
          className=" placeholder:dark:text-gray-100 w-full text-lg  dark:bg-gray-600 bg-zinc-50 rounded-md  cursor-text focus:outline-none  "
          placeholder="Search Cards"
        ></input>
      </div>
      <div className="  self-center content-center justify-center pt-1 align-middle h-full w-auto hidden min-[410px]:flex  text-lg text-center text-nowrap flex-shrink  ">
        Kanban Board
      </div>
      <div className="flex min-[410px]:w-auto  w-full  flex-row items-center  flex-shrink-0 flex-grow-0 justify-between  box-content overflow-hidden max-sm:gap-1 gap-4 ">
        <div
          className=""
          onClick={() => {
            props.setShowArchivedModal(true);
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

        <div className=" pr-0 md:pr-4">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default Header;
