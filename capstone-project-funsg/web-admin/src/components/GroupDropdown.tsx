import { Select } from "./catalystui/select.tsx";
import { Group } from "../hooks/useGroups.ts";

interface GroupDropdownProps {
  groups: Group[];
  onSelectGroup: (group: Group | null) => void;
  selectedGroup: Group | null;
}

const GroupDropdown = ({
  groups,
  onSelectGroup,
  selectedGroup,
}: GroupDropdownProps) => {
  return (
    <div>
      <Select
        value={selectedGroup?.id || ""}
        onChange={(e) => {
          const selectedGroupId = parseInt(e.target.value);
          onSelectGroup(
            groups.find((group) => group.id === selectedGroupId) || null,
          );
        }}
      >
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default GroupDropdown;
