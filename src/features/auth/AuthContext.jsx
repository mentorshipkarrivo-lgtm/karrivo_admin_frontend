import { createContext, useState, useEffect } from "react";

export const MyContext = createContext("");
const ContextProvider = ({ children }) => {
  // const [data, setData] = useState([]);

  const [data, setData] = useState(() => {
    // Retrieve the initial state from localStorage
    const savedData = localStorage.getItem("userData");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    // Save the data to localStorage whenever it changes
    if (data) {
      localStorage.setItem("userData", JSON.stringify(data));
    } else {
      localStorage.removeItem("userData");
    }
  }, [data]);

  return (
    <MyContext.Provider
      value={{
        data,
        setData
       
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default ContextProvider;
