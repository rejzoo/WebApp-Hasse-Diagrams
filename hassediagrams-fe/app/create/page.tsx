'use client'

import InputTable from '@/components/UI/InputTable'
import { useState } from 'react';

export default function CreatePage() {
    const[numberOfElements, setNumberOfElements] = useState<number>(2);
    
    return (
        <div>
            <input
                type="number"
                placeholder={`${numberOfElements}`}
                onChange={(e) => setNumberOfElements(Number(e.target.value))}
            />
            <InputTable numberOfElements={numberOfElements}/>
        </div>
    );
}