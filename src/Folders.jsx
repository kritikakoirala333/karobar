import React, { useRef } from "react";
import { GiOpenFolder } from "react-icons/gi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaFileAlt } from "react-icons/fa";
import document from "./assets/document.jpg";

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
    <div>
      {folder.type === "folder" ? (
        <div
          onContextMenu={(e) => onRightClick(e, id)}
          className="w-[240px] rounded-lg select-none bg-[#EEEEEE] cursor-pointer px-4 pt-4 flex flex-col gap-2 hover:bg-gray-200 transition"
        >
          <div className="flex justify-between items-start">
            <GiOpenFolder className="text-5xl text-yellow-500" />

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
      ) : (
        <div className="bg-[#EEEEEE] w-[240px] h-60 rounded-md p-[10px] hover:bg-gray-200 transition">
          <div className=" h-[70%] flex justify-center rounded-t-md mb-3">
            <img src={document} alt="" className="h-full w-full rounded-t-md object-cover"/>
          </div>
          <div className="">
            <p className="font-semibold mb-1">{folder.name}</p>
            <p className="line-clamp-1 text-gray-500 text-sm mb-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad,
              incidunt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
