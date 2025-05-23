import { useContext, useEffect } from "react";
import { MetaDataContext } from "../stateManagement/metaDataContext";
import { parseMetaDataSavedState } from "../functions/helperFunctions";

export interface MetaData {
  title: string;
  scale: string;
  tempo: string;
  textSize: string;
}
const MetaData = () => {
  const savedState = localStorage.getItem("metaDataState");

  const context = useContext(MetaDataContext);
  const savedMetaData = savedState
    ? parseMetaDataSavedState(savedState)
    : undefined;
  const title = context.songMetaData.title;
  const scale = context.songMetaData.scale;
  const tempo = context.songMetaData.tempo;
  const setMetaData = context.setSongMetaData;

  useEffect(() => {
    if (savedMetaData) {
      setMetaData(savedMetaData.songMetaData);
      console.log("MetaData mounted with saved state:", savedMetaData);
    }
  }, []);
  return (
    <div className="m-1 mt-5 sm:m-5 mb-10 flex justify-center items-center">
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <div className="flex-col gap-1 ">
        <div className="flex gap-1">
          <h2 className="">Scale:</h2>
          <h2 className=" font-bold">{scale}</h2>
        </div>

        <div className="flex gap-1">
          <h2 className="">Tempo:</h2>
          <h2 className=" font-bold">{tempo}</h2>
        </div>
      </div>
    </div>
  );
};

export default MetaData;
