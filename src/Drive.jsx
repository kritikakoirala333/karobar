import React, { useState, useEffect, useRef } from "react";
import Folders from "./Folders";
import PageWrapper from "./layouts/page-wrapper";
import { FaRegCopy } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { SlCursorMove } from "react-icons/sl";
import { CgRename } from "react-icons/cg";

export default function Drive() {
  const [menuData, setMenuData] = useState({
    show: false,
    x: 0,
    y: 0,
    id: null,
  });
  const menuRef = useRef(null);

  const [currentFolders, setCurrentFolders] = useState([]);

  const [pathStack, setPathStack] = useState([]);

  const root = [
    {
      name: "Documents",
      type: "folder",
      children: [
        {
          name: "Work",
          type: "folder",
          children: [
            {
              name: "Report.docx",
              type: "file",
              size: "240 KB",
              modified: "2025-09-30",
            },
            {
              name: "MeetingNotes.txt",
              type: "file",
              size: "12 KB",
              modified: "2025-10-02",
            },
          ],
        },
        {
          name: "Personal",
          type: "folder",
          children: [
            {
              name: "Resume.docx",
              type: "file",
              size: "120 KB",
              modified: "2025-08-15",
            },
            {
              name: "BankStatement.pdf",
              type: "file",
              size: "560 KB",
              modified: "2025-09-05",
            },
          ],
        },
      ],
    },
    {
      name: "Pictures",
      type: "folder",
      children: [
        {
          name: "Travel",
          type: "folder",
          children: [
            {
              name: "Paris.jpg",
              type: "file",
              size: "2.3 MB",
              modified: "2025-07-12",
            },
            {
              name: "Tokyo.png",
              type: "file",
              size: "1.9 MB",
              modified: "2025-07-15",
            },
          ],
        },
        {
          name: "Family.png",
          type: "file",
          size: "980 KB",
          modified: "2025-06-01",
        },
      ],
    },
    {
      name: "Music",
      type: "folder",
      children: [
        {
          name: "Albums",
          type: "folder",
          children: [
            {
              name: "Chill Vibes.mp3",
              type: "file",
              size: "4.8 MB",
              modified: "2025-08-05",
            },
            {
              name: "Focus Mode.mp3",
              type: "file",
              size: "5.1 MB",
              modified: "2025-08-06",
            },
          ],
        },
      ],
    },
    {
      name: "Videos",
      type: "folder",
      children: [
        {
          name: "Tutorials",
          type: "folder",
          children: [
            {
              name: "ReactBasics.mp4",
              type: "file",
              size: "15 MB",
              modified: "2025-09-01",
            },
            {
              name: "AdvancedNode.mov",
              type: "file",
              size: "22 MB",
              modified: "2025-09-10",
            },
          ],
        },
        {
          name: "Highlights.mov",
          type: "file",
          size: "8 MB",
          modified: "2025-07-25",
        },
      ],
    },
    {
      name: "Downloads",
      type: "folder",
      children: [
        {
          name: "SoftwareInstaller.exe",
          type: "file",
          size: "42 MB",
          modified: "2025-10-20",
        },
        {
          name: "Invoice.pdf",
          type: "file",
          size: "210 KB",
          modified: "2025-10-25",
        },
      ],
    },
  ];

  useEffect(() => {
    setCurrentFolders(root);
  }, []);

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setMenuData({ show: true, x: e.pageX, y: e.pageY, id });
  };

  const closeMenu = () => setMenuData({ show: false, x: 0, y: 0, id: null });

  const handleMenuClick = (option) => {
    alert(`"${option}" on folder ${menuData.id}`);
    closeMenu();
  };

  const handleDoubleClick = (folder) => {
    if (folder.type === "folder" && folder.children) {
      // Push current view to path stack
      setPathStack((prev) => [...prev, folder]);
      setCurrentFolders(folder.children);
    }
  };

  const handleGoBack = () => {
    if (pathStack.length > 0) {
      const prevFolder = pathStack[pathStack.length - 2];
      setCurrentFolders(prevFolder ? prevFolder.children : root);
      setPathStack(pathStack.slice(0, pathStack.length - 1));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    if (menuData.show) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuData.show]);

  const sortedItems = [...currentFolders].sort((a, b) => {
    if (a.type === b.type) return 0;
    return a.type === "folder" ? -1 : 1;
  });

  return (
    <PageWrapper title="Drive">
      <div className="mb-4">
        <div className="flex justify-between">
          <h5>Folders</h5>
          {pathStack.length > 0 && (
            <button
              onClick={handleGoBack}
              className="text-blue-500 hover:underline"
            >
              &larr; Back
            </button>
          )}
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4 space-x-1">
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => {
              setCurrentFolders(root);
              setPathStack([]);
            }}
          >
            Root
          </span>
          {pathStack.map((folder, index) => (
            <React.Fragment key={index}>
              <span className="text-gray-400">/</span>
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setCurrentFolders(folder.children);
                  setPathStack(pathStack.slice(0, index + 1));
                }}
              >
                {folder.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-4 gap-4">
          {sortedItems.map((folder, id) => (
            <div key={id} onDoubleClick={() => handleDoubleClick(folder)}>
              <Folders
                id={id}
                folder={folder}
                onRightClick={handleContextMenu}
              />
            </div>
          ))}
        </div>

        {/* Global single menu */}
        {menuData.show && (
          <div
            ref={menuRef}
            style={{
              top: menuData.y,
              left: menuData.x,
            }}
            className="fixed bg-white shadow-lg border text-xs rounded-md py-2 w-40 z-50 animate-fadeIn"
          >
            <div
              onClick={() => handleMenuClick("Open With")}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              <SlCursorMove /> Open With
            </div>
            <div
              onClick={() => handleMenuClick("Download")}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              <IoMdDownload /> Download
            </div>
            <div
              onClick={() => handleMenuClick("Rename")}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              <CgRename /> Rename
            </div>
            <div
              onClick={() => handleMenuClick("Copy")}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              <FaRegCopy /> Make a copy
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
