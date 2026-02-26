import { useContext } from "react";
import { DialogContext } from "@/context/AppContextProvider";

export const useDialog = () => useContext(DialogContext);
