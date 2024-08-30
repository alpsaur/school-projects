import * as Headless from "@headlessui/react";
import { Label } from "./catalystui/fieldset.tsx";
import { Select } from "./catalystui/select.tsx";

interface CategoryDropdownProps {
  categoryId: number | undefined;
  setCategoryId: (categoryId: number | undefined) => void;
}

const CategoryDropdown = ({
  categoryId,
  setCategoryId,
}: CategoryDropdownProps) => {
  return (
    <Headless.Field className="flex items-baseline gap-6 mb-4">
      <Label className="text-zinc-500 font-bold">Category</Label>
      <Select
        name="category"
        className="max-w-48"
        onChange={(event) =>
          setCategoryId(
            event.target.value ? parseInt(event.target.value) : undefined,
          )
        }
        value={categoryId}
      >
        <option value="">All Categories</option>
        <option value="1">Creative Arts</option>
        <option value="2">Business Tech</option>
        <option value="3">Community Causes</option>
        <option value="4">Health Lifestyle</option>
        <option value="5">Lifelong Learning</option>
        <option value="6">Outdoor Hobbies</option>
      </Select>
    </Headless.Field>
  );
};

export default CategoryDropdown;
