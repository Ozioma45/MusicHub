import React, { useState } from "react";

interface CategorySelectorProps {
  label: string; // e.g. "Genres", "Instruments", "Services"
  categories: Record<string, string[]>; // grouped items { "Category": ["item1","item2"] }
  values: string[]; // selected items from parent form
  setValues: (items: string[]) => void; // update function
  allowCustom?: boolean; // if true, allows text input for custom items
  placeholder?: string; // placeholder text for custom input
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  label,
  categories,
  values,
  setValues,
  allowCustom = false,
  placeholder = "Enter custom item",
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const toggleItem = (item: string, checked: boolean) => {
    if (checked) {
      setValues([...values, item]);
    } else {
      setValues(values.filter((v) => v !== item));
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values.filter((v) => v !== "Other"), trimmed]); // replace "Other" with custom value
      setCustomInput("");
    }
  };

  return (
    <div className="mb-6">
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setOpenDropdown(!openDropdown)}
        className="w-full flex justify-between items-center px-4 py-3 border rounded-lg bg-white shadow-sm hover:bg-gray-50"
      >
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">{openDropdown ? "▲" : "▼"}</span>
      </button>

      {openDropdown && (
        <div className="mt-2 border rounded-lg p-3 bg-gray-50 max-h-80 overflow-y-auto">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-2">
              {/* Accordion Header */}
              <button
                type="button"
                className="flex justify-between items-center w-full font-semibold text-left py-2 px-2 hover:bg-gray-100 rounded"
                onClick={() =>
                  setOpenCategory(openCategory === category ? null : category)
                }
              >
                {category}
                <span className="text-gray-500">
                  {openCategory === category ? "▲" : "▼"}
                </span>
              </button>

              {/* Accordion Content */}
              {openCategory === category && (
                <div className="pl-4 py-2 space-y-2">
                  {items.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={values.includes(item)}
                        onChange={(e) => toggleItem(item, e.target.checked)}
                        className="rounded"
                      />
                      {item}
                    </label>
                  ))}

                  {/* Only add Other if allowCustom is true */}
                  {allowCustom && (
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.includes("Other")}
                        onChange={(e) => toggleItem("Other", e.target.checked)}
                        className="rounded"
                      />
                      Other
                    </label>
                  )}

                  {/* Show input only if "Other" is selected */}
                  {allowCustom && values.includes("Other") && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustom}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected tags */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {values.map((val, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {val}
              <button
                type="button"
                onClick={() => setValues(values.filter((v) => v !== val))}
                className="text-gray-600 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
