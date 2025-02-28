'use client'

import InputTable from '@/components/UI/InputTable'
import { useState } from 'react';

export default function CreatePage() {
    const[numberOfElements, setNumberOfElements] = useState<number>(2);
    
    return (
        <div>
            <div className="flex flex-row items-center space-x-4 pb-8">
                <span className="text-xl">Number of elements</span>
                <select
                    value={numberOfElements}
                    onChange={(e) => setNumberOfElements(Number(e.target.value))}
                    className="w-15 px-2 py-1 rounded-md focus:outline-none bg-[var(--itemsbackground)] text-[var(--foreground)] text-lg"
                    >
                    {Array.from({ length: 9 }, (_, i) => (
                        <option key={i} value={i + 2}>
                        {i + 2}
                        </option>
                    ))}
                </select>
            </div>
            <InputTable numberOfElements={numberOfElements}/>
        </div>
    );
}