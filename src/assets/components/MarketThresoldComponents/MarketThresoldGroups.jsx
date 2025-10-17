import { RiStockLine } from "react-icons/ri";
import { MdExposurePlus1 } from "react-icons/md";
import { useContext, useMemo, useState } from "react";
import ThresoldGroupContext from "../../contexts/MarketThresold/ThresoldGroup/ThresoldGroupContext";
import LoadingPage from "../LoadingComponents/LoadingPage";

export default function MarketThresoldGroups({ onGroupClick }) {
  const { groups = [], loading, addGroup } = useContext(ThresoldGroupContext);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  const sortedGroups = useMemo(() => {
    const active = groups.filter((g) => g.active);
    const inactive = groups.filter((g) => !g.active);
    return [...active, ...inactive];
  }, [groups]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return alert("Group name is required.");
    setCreating(true);
    try {
      await addGroup({ groupName: newGroupName });
      setNewGroupName("");
      setShowModal(false);
    } catch (err) {
      alert("Failed to create group");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onGroupClick(group)}
            className={`aspect-square flex flex-col items-center justify-center rounded-2xl shadow-md cursor-pointer transition-all duration-200
              bg-white hover:shadow-lg
              ${!group.active ? "opacity-60" : ""}`}
          >
            <RiStockLine className="text-4xl text-black mb-2" />
            <p className={`text-lg font-semibold ${!group.active ? "text-gray-500 italic" : "text-gray-800"}`}>
              {group.groupName}
            </p>
            {!group.active && <p className="text-xs text-gray-500 mt-1">(Inactive)</p>}
          </div>
        ))}

        <div
          onClick={() => setShowModal(true)}
          className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-400 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all duration-200"
        >
          <MdExposurePlus1 className="text-4xl text-black mb-1" />
          <p className="text-base font-medium text-black">Add Group</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4 text-black">Create New Group</h3>
            <input
              type="text"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGroup}
                className={`px-3 py-1 rounded-lg text-white ${creating ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"}`}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary:
// Uses LoadingPage component while group data is loading
// Renders groups grid only after loading is complete
// Maintains add group modal and creation functionality
