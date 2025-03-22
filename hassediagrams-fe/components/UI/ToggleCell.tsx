interface ToggleCellProps {
  currentValue: number | null;
  onSelect: (value: number | null) => void;
}

export default function ToggleCell({
  currentValue,
  onSelect,
}: ToggleCellProps) {
  const width = 14;
  const height = 10;

  return (
    <div className="flex items-center space-x-1 w-[180px]">
      <button
        onClick={() => onSelect(0)}
        className={`w-14 h-10 flex items-center justify-center rounded-md transition-colors text-xl
                ${
                  currentValue === 0
                    ? "bg-gray-500 text-white"
                    : "bg-[var(--itemsbackground)]/20 text-[var(--foreground)] hover:bg-red-500"
                }`}
      >
        0
      </button>

      <button
        onClick={() => onSelect(1)}
        className={`w-14 h-10 flex items-center justify-center rounded-md transition-colors text-xl
                ${
                  currentValue === 1
                    ? "bg-gray-500 text-white"
                    : "bg-[var(--itemsbackground)]/20 text-[var(--foreground)] hover:bg-red-500"
                }`}
      >
        1
      </button>

      {currentValue !== null && (
        <button
          onClick={() => onSelect(null)}
          className={`w-14 h-10 flex items-center justify-center rounded-md transition-colors text-medium 
                    ${
                      currentValue === null
                        ? "bg-gray-500 text-white"
                        : "bg-[var(--itemsbackground)]/20 text-[var(--foreground)] hover:bg-red-500"
                    }`}
        >
          Clear
        </button>
      )}
    </div>
  );
}
