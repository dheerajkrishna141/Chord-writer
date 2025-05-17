import { useDroppable } from "@dnd-kit/core";
import { useAnimationControls } from "framer-motion";
import { PropsWithChildren, useEffect } from "react";

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
    <div ref={setNodeRef}>
      <div
        className={` ${
          isOver ? `border-red-300 text-red-300` : `text-[#E2E8F0]`
        } mt-2 text-center p-3 bg-[#1A202C] border-2 border-dashed rgba(226, 232, 240, 0.6) rounded-md  hover:border-red-300 hover:text-red-300 transition-colors`}
      >
        <i className="fas fa-trash-alt fa-lg mr-2"></i> Drop here to delete
      </div>
      {children}
    </div>
  );
};

export default DeleteBox;
