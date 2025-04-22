import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

interface dropBoxProps extends PropsWithChildren {
  id: string;
}

const DropBox = ({ children, id }: dropBoxProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className=" rounded-md min-w-5 min-h-5 h-fit w-fit ">
      {children}
    </div>
  );
};

export default DropBox;
