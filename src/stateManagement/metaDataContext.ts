import React, { Dispatch } from "react";
import { MetaData } from "../components/MetaData";

export interface MetaDataContext {
  setSongMetaData: Dispatch<React.SetStateAction<MetaData>>;
  songMetaData: MetaData;
}

export const MetaDataContext = React.createContext<MetaDataContext>(
  {} as MetaDataContext
);
