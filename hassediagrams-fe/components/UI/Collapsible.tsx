import { useState } from "react";

interface CollProbs {
  title: string;
  opened: boolean;
  children: React.ReactNode;
}

export default function Collapsible({ title, opened, children }: CollProbs) {
  const [isVisible, setIsVisible] = useState(opened);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsVisible((prev) => !prev)}
        className="w-full py-2 px-4 bg-[var(--itemsbackground)] rounded-md flex items-center space-x-2 font-bold hover:bg-[#26233d]"
      >
        <span>{isVisible ? "▲" : "▼"}</span>
        <span className="text-xl">{title}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
