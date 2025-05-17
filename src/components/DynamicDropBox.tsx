import { useDroppable } from "@dnd-kit/core";
import { motion, useAnimationControls } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { ChordContext } from "../stateManagement/chordContext";

interface dynamicDropBoxProps {
  id: string;
}
const DynamicDropBox = ({ id }: dynamicDropBoxProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: id });
  const [isHover, setIsHover] = useState(false);

  const context = useContext(ChordContext);
  const activeId = context.activeDragId;
  const controls = useAnimationControls();

  useEffect(() => {
    if (isOver) {
      if (activeId && activeId.includes("-")) {
        return;
      }
      controls.start("hover").then(() => {
        context.setCanvasState((prev) => {
          const newCanvas = [...prev];
          const sectionIndex = parseInt(id.split("-")[1]);
          const lyricIndex = parseInt(id.split("-")[2]);
          newCanvas[sectionIndex].SectionState[lyricIndex].ChordBoxes.push({
            isEmpty: true,
            count: 0,
          });
          return newCanvas;
        });
        controls.set("initial");
      });
    }
  }, [isOver]);
  return (
    <motion.div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      ref={setNodeRef}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      animate={controls}
      variants={{
        initial: {
          scale: 1,

          transition: { duration: 0.5 },
        },
        hover: { scale: 2 },
      }}
      className="print-hide rounded-md  h-fit w-fit flex items-center justify-center"
    >
      {isHover ? (
        <div className="flex-col">
          <div className="absolute -top-12 px-[2px] border bg-white z-10 shadow-sm w-30 h-fit border-gray-300 p-[1px] text-center">
            <p className="text-sm">Hover chord to add chord boxes</p>
          </div>{" "}
          <MdAddBox size={30} color="green" />
        </div>
      ) : (
        <MdAddBox size={30} color="green" />
      )}
    </motion.div>
  );
};

export default DynamicDropBox;
