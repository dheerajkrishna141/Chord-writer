import { useDraggable } from "@dnd-kit/core";
import { Chord } from "./ChordConfigBar";
import { scales } from "../data/ChordConfigData";

interface props {
  chord: Chord;
}
const ChordBox = ({ chord }: props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: chord.id,
  });
  const style = transform
    ? {
        transform: "translate(" + transform.x + "px," + transform.y + "px)",
      }
    : undefined;
  const renderSuffix = scales.find(
    (scale) => scale.name === chord.scale
  )?.suffix;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-neutral-200 rounded-lg p-3 w-fit"
    >
      {chord.rootNote}
      <span className="text-sm">{renderSuffix}</span>
    </div>
  );
};

export default ChordBox;
