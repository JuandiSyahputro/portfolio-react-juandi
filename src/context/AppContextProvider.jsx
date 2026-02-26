import { createContext, useState } from "react";

const DialogContext = createContext();

const AppContextProvider = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const handleClickPopup = (link) => {
    console.log(link);
    if (link !== "#") window.open(link, "_blank");
    else setOpenPopup(true);
  };

  const handleCloseClickPopup = () => {
    setOpenPopup(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return <DialogContext.Provider value={{ openDialog, handleOpenDialog, handleCloseDialog, openPopup, handleClickPopup, handleCloseClickPopup }}>{children}</DialogContext.Provider>;
};

export { DialogContext };
export default AppContextProvider;
