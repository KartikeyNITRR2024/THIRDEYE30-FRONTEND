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
  const { updateGroupStatus, fetchGroupById, deleteGroup } = useContext(ThresoldGroupContext);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(group);
  const [updating, setUpdating] = useState(false);

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
    await updateGroupStatus(currentGroup.id, !currentGroup.active, undefined, undefined);
    setCurrentGroup((prev) => ({ ...prev, active: !prev.active }));
    setUpdating(false);
  };

  const handleDeleteGroup = async () => {
    if (!currentGroup) return;
    setDeleting(true);
    await deleteGroup(currentGroup.id);
    setDeleting(false);
    setShowDeleteModal(false);
    onBack(); // Go back to group list
  };

  const cardBaseClass =
    "aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg";

  const disabledCardClass =
    "opacity-50 cursor-not-allowed pointer-events-none"; // visually disabled + non-clickable

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
        {currentGroup?.groupName || "Market Threshold"}
      </h2>

      {!activeTable ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {/* Play/Pause Card */}
          <div
            onClick={handleToggleActive}
            className={`${cardBaseClass} ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
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

          {/* Threshold Card */}
          <div
            onClick={() => {
              if (currentGroup?.active) setActiveTable("threshold");
            }}
            className={`${cardBaseClass} ${
              !currentGroup?.active ? disabledCardClass : ""
            }`}
          >
            <SlGraph className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Threshold</p>
          </div>

          {/* Stock Card */}
          <div
            onClick={() => {
              if (currentGroup?.active) setActiveTable("stock");
            }}
            className={`${cardBaseClass} ${
              !currentGroup?.active ? disabledCardClass : ""
            }`}
          >
            <RiStockLine className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Stock</p>
          </div>

          {/* Chat ID Card */}
          <div
            onClick={() => {
              if (currentGroup?.active) setActiveTable("chat");
            }}
            className={`${cardBaseClass} ${
              !currentGroup?.active ? disabledCardClass : ""
            }`}
          >
            <PiTelegramLogoDuotone className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Chat ID</p>
          </div>

          {/* Delete Card */}
          <div
            onClick={() => setShowDeleteModal(true)}
            className={`${cardBaseClass} ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <MdDeleteOutline className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">
              {deleting ? "Deleting..." : "Delete"}
            </p>
          </div>

          {/* Back Card */}
          <div onClick={onBack} className={cardBaseClass}>
            <MdArrowBack className="text-4xl text-black mb-2" />
            <p className="text-lg font-semibold text-black">Back</p>
          </div>
        </div>
      ) : activeTable === "threshold" ? (
        <Thresold group={currentGroup} onBack={() => setActiveTable(null)} />
      ) : activeTable === "chat" ? (
        <ChatID group={currentGroup} onBack={() => setActiveTable(null)} />
      ) : (
        <Stock group={currentGroup} onBack={() => setActiveTable(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4 text-black">Delete Group</h3>
            <p className="text-black mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{currentGroup.groupName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className={`px-3 py-1 rounded-lg text-white ${
                  deleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
