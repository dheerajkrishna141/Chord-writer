import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren, useContext, useEffect } from "react";
import { ChordContext } from "../stateManagement/chordContext";
import { motion, useAnimationControls } from "framer-motion";

interface dynamicDropBoxProps extends PropsWithChildren {
  id: string;
}
const DynamicDropBox = ({ id, children }: dynamicDropBoxProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: id });

  const context = useContext(ChordContext);

  const controls = useAnimationControls();

  useEffect(() => {
    if (isOver) {
      controls.start("hover").then(() => {
        context.setCanvasState((prev) => {
          const newCanvas = [...prev];
          const lyricIndex = parseInt(id.split("-")[2]);
          newCanvas[lyricIndex].ChordBoxes.push({ isEmpty: true, count: 0 });
          return newCanvas;
        });
        controls.set("initial");
      });
    }
  }, [isOver]);
  return (
    <motion.div
      ref={setNodeRef}
      initial={{ scale: 1, backgroundColor: "grey" }}
      whileHover={{ scale: 2, backgroundColor: "lightblue" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      animate={controls}
      variants={{
        initial: {
          scale: 1,
          backgroundColor: "grey",
          transition: { duration: 0.5 },
        },
        hover: { scale: 2, backgroundColor: "lightblue" },
      }}
      className="rounded-md min-w-5 min-h-5 h-fit w-fit"
    >
      {children}
    </motion.div>
  );
};

export default DynamicDropBox;
