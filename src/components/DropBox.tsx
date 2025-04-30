import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren, useContext, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { ChordContext } from "../stateManagement/chordContext";

interface dropBoxProps extends PropsWithChildren {
  id: string;
}

const DropBox = ({ children, id }: dropBoxProps) => {
  const context = useContext(ChordContext);

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const controls = useAnimationControls();

  useEffect(() => {
    if (context.isDragging) {
      if (isOver) {
        controls.stop();
        controls.start("hover");
      } else {
        controls.start("initial");
        controls.start("isDragging");
      }
    } else {
      controls.stop(); // Stop any ongoing animations
      controls.start("initial");
    }
  }, [isOver, context.isDragging]);

  return (
    <motion.div
      ref={setNodeRef}
      className=" rounded-md min-w-5 min-h-5 h-fit w-fit "
      animate={controls}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
      variants={{
        initial: {
          scale: 1,
          backgroundColor: "#ffffff",
          transition: { duration: 0.2, ease: "easeInOut" },
        },
        isDragging: {
          backgroundColor: context.isDragging
            ? ["#22d267", "#ffffff", "#22d267"]
            : ["#ffffff"],
          transition: { duration: 2, repeatType: "loop", repeat: Infinity },
        },
        hover: { scale: 2, transition: { duration: 0.2, ease: "easeInOut" } },
      }}
    >
      {children}
    </motion.div>
  );
};

export default DropBox;
