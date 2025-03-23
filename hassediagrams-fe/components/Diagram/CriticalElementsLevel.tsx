
interface CritElemLvlProps {
    level: string;
    elements: string[][];
}

export default function CriticalElementsLevel({ level, elements } : CritElemLvlProps) {

    return (
        <div className="flex flex-row">
            <p>Level {level}: </p>
            {elements.map((elemGroup, index) => (
                <p key={index} className="ml-4">
                {"{" + elemGroup.join(", ") + "}"}
                </p>
            ))}
        </div>
    );
}