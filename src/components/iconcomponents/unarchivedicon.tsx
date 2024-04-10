import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const unArchivedIcon = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fillColor = mounted
    ? theme === "dark"
      ? "#22c55e"
      : "#616161"
    : "#616161";

  if (!mounted) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 -960 960 960"
      width="32"
      fill={fillColor}
    >
      <path d="M480-560 320-400l56 56 64-64v168h80v-168l64 64 56-56-160-160Zm-280-80v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z" />{" "}
    </svg>
  );
};

export default unArchivedIcon;
