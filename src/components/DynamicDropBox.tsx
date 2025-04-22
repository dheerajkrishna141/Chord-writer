import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren, useContext, useEffect } from "react";
import { ChordContext } from "../stateManagement/chordContext";

interface dynamicDropBoxProps extends PropsWithChildren {
  id: string;
}
const DynamicDropBox = ({ id, children }: dynamicDropBoxProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: id });

  const context = useContext(ChordContext);

  const style = isOver
    ? { scale: 1.05, backgroundColor: "lightblue" }
    : undefined;

  useEffect(() => {
    if (isOver) {
      context.setCanvasState((prev) => {
        const newCanvas = [...prev];
        const lyricIndex = parseInt(id.split("-")[2]);
        newCanvas[lyricIndex].ChordBoxes.push(true);
        return newCanvas;
      });
    }
  }, [isOver]);
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md min-w-5 min-h-5 h-fit w-fit"
    >
      {children}
    </div>
  );
};

export default DynamicDropBox;
