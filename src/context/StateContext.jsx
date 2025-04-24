import React, { createContext, useEffect, useState } from "react";

export const StateContext = createContext();

const StateProvider = ({ children }) => {
  const [sidebarMenu, setSidebarMenu] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("referral_amount");
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    if (windowWidth < 991) {
      setSidebarMenu(true);
    } else {
      setSidebarMenu(false);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <StateContext.Provider
      value={{
        sidebarMenu,
        setSidebarMenu,
        amount,
        setAmount,
        transactionType,
        setTransactionType,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
