import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isChecked = theme === "dark";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const sliderVariants = {
    checked: { x: 40 },
    unchecked: { x: 0 },
  };

  const backgroundVariants = {
    checked: { backgroundColor: "#22c55e" },
    unchecked: { backgroundColor: "#D1D5DB" },
  };

  return (
    <motion.div whileHover={{ scale: 1.1 }} className="text-xl z-10 ">
      <motion.div
        initial={false}
        animate={isChecked ? "checked" : "unchecked"}
        className="relative w-24 h-10 flex items-center flex-shrink-0 ml-4 p-1 rounded-full cursor-pointer"
        variants={backgroundVariants}
        onClick={toggleTheme}
      >
        <motion.span
          className="w-12 h-8 bg-white rounded-full shadow-md flex justify-center items-center"
          layout
          variants={sliderVariants}
        >
          {/* Conditionally render the moon or sun icon based on the theme */}
          {isChecked ? (
            <motion.img
              src="/svg/dark_mode.svg"
              alt="Dark Mode"
              className="w-4 h-4"
              initial="unchecked"
              animate="checked"
            />
          ) : (
            <motion.img
              src="/svg/light_mode.svg"
              alt="Light Mode"
              className="w-4 h-4"
              initial="checked"
              animate="unchecked"
            />
          )}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSwitch;
