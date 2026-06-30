import { useContext } from "react";
import { AppSessionContext } from "../components/providers/AppSessionProvider";

export function useAppSession() {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error("useAppSession must be used within AppSessionProvider");
  }

  return context;
}