import { useContext, useState, useEffect } from "react";
import { RiStockLine } from "react-icons/ri";
import { SlGraph } from "react-icons/sl";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { MdArrowBack, MdDeleteOutline } from "react-icons/md";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";

import Thresold from "./Thresold";
import ChatID from "./ChatID";
import Stock from "./Stock";
import ThresoldGroupContext from "../../contexts/MarketThresold/ThresoldGroup/ThresoldGroupContext";

export default function MarketThresoldGroup({ group, onBack }) {
  const { updateGroupStatus, fetchGroupById, deleteGroup } =
    useContext(ThresoldGroupContext);

  const [activeTable, setActiveTable] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(group);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      const freshGroup = await fetchGroupById(group.id);
      if (freshGroup) setCurrentGroup(freshGroup);
    };
    loadGroup();
  }, [group]);

  const handleToggleActive = async () => {
    if (!currentGroup) return;
    setUpdating(true);
    await updateGroupStatus(
      currentGroup.id,
      !currentGroup.active,
      undefined,
      undefined
    );
    setCurrentGroup((prev) => ({ ...prev, active: !prev.active }));
    setUpdating(false);
  };

  const handleDeleteGroup = async () => {
    if (!currentGroup) return;
    setDeleting(true);

    // Provider will show confirm alert itself, no modal here
    await deleteGroup(currentGroup.id);

    setDeleting(false);
    onBack(); // Return after deletion
  };

  const cardBaseClass =
    "aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg";

  const disabledCardClass =
    "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
        {currentGroup?.groupName || "Market Threshold"}
      </h2>

      {!activeTable ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

          {/* Play/Pause */}
          <div
            onClick={handleToggleActive}
            className={`${cardBaseClass} ${
              updating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {currentGroup?.active ? (
              <GiPauseButton className="text-4xl text-black mb-2" />
            ) : (
              <GiPlayButton className="text-4xl text-black mb-2" />
            )}
            <p className="text-lg font-semibold text-black">
              {currentGroup?.active ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Threshold */}
          <div
            onClick={() => currentGroup?.active && setActiveTable("threshold")}
            className={`${cardBaseClass} ${
              !currentGroup?.active ? disabledCardClass : ""
            }`}
          >
            <SlGraph className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Threshold</p>
          </div>

          {/* Stock */}
          <div
            onClick={() => currentGroup?.active && setActiveTable("stock")}
            className={`${cardBaseClass} ${
              !currentGroup?.active ? disabledCardClass : ""
            }`}
          >
            <RiStockLine className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Stock</p>
          </div>

          {/* Chat ID */}
          <div
            onClick={() => currentGroup?.active && setActiveTable("chat")}
            className={`${cardBaseClass} ${
              !currentGroup?.active ? disabledCardClass : ""
            }`}
          >
            <PiTelegramLogoDuotone className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Chat ID</p>
          </div>

          {/* DELETE */}
          <div
            onClick={handleDeleteGroup}
            className={`${cardBaseClass} ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <MdDeleteOutline className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">
              {deleting ? "Deleting..." : "Delete"}
            </p>
          </div>

          {/* Back */}
          <div onClick={onBack} className={cardBaseClass}>
            <MdArrowBack className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Back</p>
          </div>
        </div>
      ) : activeTable === "threshold" ? (
        <Thresold
          group={currentGroup}
          onBack={() => setActiveTable(null)}
        />
      ) : activeTable === "chat" ? (
        <ChatID
          group={currentGroup}
          onBack={() => setActiveTable(null)}
        />
      ) : (
        <Stock
          group={currentGroup}
          onBack={() => setActiveTable(null)}
        />
      )}
    </div>
  );
}
