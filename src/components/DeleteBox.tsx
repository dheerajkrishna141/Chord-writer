import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsTrash2Fill } from "react-icons/bs";
import { motion, useAnimationControls } from "framer-motion";

interface dropBoxProps extends PropsWithChildren {
  id: string;
}

const DeleteBox = ({ children, id }: dropBoxProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const controls = useAnimationControls();

  useEffect(() => {
    if (isOver) {
      controls.start("hover");
    } else {
      controls.start("initial");
    }
  }, [isOver]);

  return (
    <motion.div
      animate={controls}
      ref={setNodeRef}
      className=" rounded-md min-w-5 min-h-5 h-fit w-fit  hover:scale-150 transition-all duration-200 ease-in-out"
      variants={{
        initial: {
          scale: 1,
          transition: { duration: 0, ease: "easeInOut" },
        },
        hover: { scale: 2, transition: { duration: 0, ease: "easeInOut" } },
      }}
    >
      {isOver ? (
        <BsTrash2Fill color="red" size={"25px"} />
      ) : (
        <RiDeleteBin6Line color="red" size={"25px"} />
      )}
      {children}
    </motion.div>
  );
};

export default DeleteBox;
