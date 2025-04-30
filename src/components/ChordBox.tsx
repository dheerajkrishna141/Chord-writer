import { useDraggable } from "@dnd-kit/core";
import { Chord } from "./ChordConfigBar";
import { scales } from "../data/ChordConfigData";
import { motion } from "framer-motion";

interface props {
  chord: Chord;
  isPlaced?: boolean;
  className?: string;
}
const ChordBox = ({ chord, isPlaced, className }: props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: chord.id,
  });

  var style = {
    padding: isPlaced ? "0.2rem" : "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
    ...(transform
      ? {
          transform: "translate(" + transform.x + "px," + transform.y + "px)",
        }
      : {}),
  };

  const renderSuffix = scales.find(
    (scale) => scale.name === chord.scale
  )?.suffix;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`${className} rounded-lg w-fit z-1`}
    >
      {chord.rootNote}
      <span className="text-sm">{renderSuffix}</span>
    </div>
  );
};

export default ChordBox;
