import { useContext } from "react";
import { MetaDataContext } from "../stateManagement/metaDataContext";

export interface MetaData {
  title: string;
  scale: string;
  tempo: string;
}
const MetaData = () => {
  const context = useContext(MetaDataContext);
  const title = context.songMetaData.title;
  const scale = context.songMetaData.scale;
  const tempo = context.songMetaData.tempo;
  return (
    <div className="m-5 mb-10 flex justify-center items-center">
      <div className=" mx-auto">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="flex-col gap-1">
        <div className="flex gap-1">
          <h2 className="text-base">Scale</h2>
          <h2 className="text-base font-bold">{scale}</h2>
        </div>

        <div className="flex gap-1">
          <h2 className="text-base">Tempo</h2>
          <h2 className="text-base font-bold">{tempo}</h2>
        </div>
      </div>
    </div>
  );
};

export default MetaData;
