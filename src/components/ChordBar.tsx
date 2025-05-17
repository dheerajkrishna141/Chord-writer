import { useContext } from "react";
import { ChordContext } from "../stateManagement/chordContext";
import ChordBox from "./ChordBox";
import CustomChord from "./CustomChord";
import DeleteBox from "./DeleteBox";

const ChordBar = () => {
  const context = useContext(ChordContext);

  return (
    <div className="print-hide card sticky top-20 h-fit z-10 p-5 shadow-md rounded-md m-5 w-fit ">
      <div className="flex flex-col gap-5 items-center">
        <div className="flex-col  gap-2">
          <p className="font-display text-2xl text-center text-[#E2E8F0] mb-4">
            CHORD PALETTE
          </p>
          <div className="flex justify-center">
            <div className="inline-grid grid-cols-2 lg:grid-cols-3 gap-2 w-auto">
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
        </div>
        <CustomChord />
        <div className="mt-2 pt-4 border-t-2 border-dashed rgba(226, 232, 240, 0.6)">
          <DeleteBox id="deleteBox"></DeleteBox>
        </div>
      </div>
    </div>
  );
};

export default ChordBar;
