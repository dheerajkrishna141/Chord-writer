import React from "react";
import { ChordContext } from "../stateManagement/chordContext";
import ChordBox from "./ChordBox";
import CustomChord from "./CustomChord";
import DeleteBox from "./DeleteBox";

interface props {
  NavActive: boolean;
  setNavActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Aside = ({ NavActive, setNavActive }: props) => {
  const context = React.useContext(ChordContext);
  return (
    <div>
      <aside className={`aside ${NavActive && `active`} fixed top-0 z-100`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setNavActive(!NavActive)}
            className=" btn-primary px-2 py-1 rounded-full text-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="flex-col  gap-2 mb-10">
          <p className="font-display text-2xl text-center text-[#E2E8F0] mb-4">
            CHORD PALETTE
          </p>
          <div className="flex justify-center">
            <div
              className="inline-grid grid-cols-3 gap-3 w-auto"
              style={{ gridTemplateColumns: "repeat(3, auto)" }}
            >
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
      </aside>
    </div>
  );
};

export default Aside;
