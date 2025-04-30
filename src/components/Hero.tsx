import { useContext } from "react";
import ChordBox from "./ChordBox";
import ChordConfigBar from "./ChordConfigBar";
import { ChordContext } from "../stateManagement/chordContext";
import DropBox from "./DropBox";

const Hero = () => {
  const context = useContext(ChordContext);
  return (
    <div className="chord-config">
      <ChordConfigBar />

      <div className="flex-col mb-10">
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
        <div>
          <h1>Drop here to delete</h1>
          <DropBox id="deleteBox">
            <div className="w-10 h-10 bg-red-500"></div>
          </DropBox>
        </div>
      </div>
    </div>
  );
};

export default Hero;
