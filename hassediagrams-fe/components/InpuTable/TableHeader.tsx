import React from 'react';

interface TableHeaderProps {
  headers: string[];
}

export default function TableHeader({ headers }: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-20 bg-[var(--itemsbackground)]">
      <tr>
        <th className="h-12 px-4 text-center text-xl font-light uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[var(--itemsbackground)] w-10">
          #
        </th>
        <th className="h-12 px-4 text-center text-xl font-light uppercase w-[170px]">
          System
        </th>
        {headers.map((header, index) => (
          <th
            key={index}
            className="h-12 px-4 text-center text-xl font-light uppercase w-[170px]"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
