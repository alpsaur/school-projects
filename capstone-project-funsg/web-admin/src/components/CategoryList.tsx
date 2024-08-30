import { Category } from "../hooks/useCategory.ts";
import { Heading } from "./catalystui/heading.tsx";

interface Props {
  categories: Category[];
  onSelectCategory: (category: Category | null) => void;
  selectedCategory: Category | null;
}

const CategoryList = ({
  selectedCategory,
  onSelectCategory,
  categories,
}: Props) => {
  return (
    <>
      <Heading onClick={() => onSelectCategory(null)}>Category</Heading>
      <ul role="list" className="divide-y divide-gray-100">
        {categories?.map((category) => (
          <li
            className={`flex justify-between gap-x-4 py-5 w-44 cursor-pointer p-2 ${
              selectedCategory?.id === category.id ? "bg-blue-100" : ""
            }`}
            key={category.id}
            onClick={() => onSelectCategory(category)}
          >
            <span className="w-full text-left">{category.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CategoryList;
