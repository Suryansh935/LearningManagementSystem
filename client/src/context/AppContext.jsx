import { createContext } from "react";

const AppContext = createContext();

export const AppContextProvider = (props) => {
  const value = {
    // put shared state / functions here
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
