import React, { useRef } from "react";
import { GiOpenFolder } from "react-icons/gi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaFileAlt } from "react-icons/fa";

export default function Folders({ id, folder, onRightClick }) {
  const dotsRef = useRef(null);

  const handleDotsClick = (e) => {
    e.stopPropagation();
    const rect = dotsRef.current.getBoundingClientRect();
    onRightClick(
      {
        preventDefault: () => {},
        stopPropagation: () => {},
        pageX: rect.left,
        pageY: rect.bottom + window.scrollY,
      },
      id
    );
  };

  return (
    <div
      onContextMenu={(e) => onRightClick(e, id)}
      className="w-[220px] rounded-lg select-none bg-gray-100 cursor-pointer px-4 pt-4 flex flex-col gap-2 hover:bg-gray-200 transition"
    >
      <div className="flex justify-between items-start">
        {folder.type === "folder" ? (
            <GiOpenFolder className="text-5xl text-yellow-500" />
          ) : (
            <FaFileAlt className="text-5xl text-gray-500" />
          )}
        <HiOutlineDotsVertical
          ref={dotsRef}
          onClick={handleDotsClick}
          className="text-gray-600 hover:text-black cursor-pointer"
        />
      </div>
      <div className="font-semibold"> {folder.name}</div>
      <div className="flex justify-between">
        <p className="text-gray-600 text-sm">256 files</p>
        <div className="font-semibold text-sm">11 GB</div>
      </div>
    </div>
  );
}
