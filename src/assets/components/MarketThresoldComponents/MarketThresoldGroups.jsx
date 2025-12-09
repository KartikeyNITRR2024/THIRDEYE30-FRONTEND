import { RiStockLine } from "react-icons/ri";
import { MdExposurePlus1 } from "react-icons/md";
import { useContext, useMemo } from "react";
import ThresoldGroupContext from "../../contexts/MarketThresold/ThresoldGroup/ThresoldGroupContext";
import PropertyContext from "../../contexts/Property/PropertyContext";
import LoadingPage from "../LoadingComponents/LoadingPage";

export default function MarketThresoldGroups({ onGroupClick }) {
  const { groups = [], loading, addGroup } = useContext(ThresoldGroupContext);
  const { properties } = useContext(PropertyContext);

  const sortedGroups = useMemo(() => {
    const active = groups.filter((g) => g.active);
    const inactive = groups.filter((g) => !g.active);
    return [...active, ...inactive];
  }, [groups]);

  // Check if max group limit reached
  const reachedMax =
    groups.length >= properties.MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER;

  return (
    <div>
      {/* Header showing count */}
      <div className="flex justify-end items-center mb-4">
        <div className="text-sm md:text-base text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
          <span className="font-semibold">
            {groups.length} /{" "}
            {properties.MAXIMUM_NO_OF_THRESOLD_GROUP_PER_USER} groups created
          </span>
        </div>
      </div>

      {/* Groups Grid */}
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
            <p
              className={`text-lg font-semibold ${
                !group.active ? "text-gray-500 italic" : "text-gray-800"
              }`}
            >
              {group.groupName}
            </p>

            {!group.active && (
              <p className="text-xs text-gray-500 mt-1">(Inactive)</p>
            )}
          </div>
        ))}

        {/* Add Group Card (only if not reached max) */}
        {!reachedMax && (
          <div
            onClick={addGroup}
            className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-400 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all duration-200"
          >
            <MdExposurePlus1 className="text-4xl text-black mb-1" />
            <p className="text-base font-medium text-black">Add Group</p>
          </div>
        )}
      </div>
    </div>
  );
}
