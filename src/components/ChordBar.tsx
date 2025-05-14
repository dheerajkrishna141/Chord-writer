import { useContext, useEffect } from "react";
import { ChordContext } from "../stateManagement/chordContext";
import { MetaDataContext } from "../stateManagement/metaDataContext";
import useLocalStorage from "../stateManagement/useLocalStorage";
import ChordBox from "./ChordBox";
import CustomChord from "./CustomChord";
import DeleteBox from "./DeleteBox";

const ChordBar = () => {
  const context = useContext(ChordContext);
  const metaContext = useContext(MetaDataContext);
  const { setItem } = useLocalStorage("canvasState");
  const { setItem: setChordContextItem } = useLocalStorage("metaDataState");
  const handleSave = () => {
    setItem(context);
    setChordContextItem(metaContext);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, 1 * 60 * 1000); // 1 minute in milliseconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [context]);
  return (
    <div className="chord-bar sticky top-0 bg-white z-10 p-5 shadow-md rounded-md m-5">
      <div className="flex gap-5 items-center">
        <div className="flex-col  gap-2">
          <div>
            <h1>Chords</h1>
            <div className="flex gap-2">
              {context?.potentialChords &&
                context.potentialChords.map((chord, index) => (
                  <ChordBox
                    className="bg-gray-300"
                    isPlaced={false}
                    key={index}
                    chord={chord}
                  />
                ))}
            </div>
          </div>
          <div>
            <h1>Drop here to delete</h1>
            <DeleteBox id="deleteBox"></DeleteBox>
          </div>
        </div>
        <CustomChord />
      </div>

      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ChordBar;
