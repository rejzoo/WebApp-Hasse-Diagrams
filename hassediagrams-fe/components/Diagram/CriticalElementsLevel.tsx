interface CritStatesLvlProps {
  level: string;
  elements: number[][];
}

export default function CriticalStatesLevel({
  level,
  elements,
}: CritStatesLvlProps) {
  return (
    <div className="flex flex-row">
      <p>Level {level}: </p>
      {elements.map((elemGroup, index) => (
        <p key={index} className="ml-4">
          {"[" + elemGroup.join("") + "]"}
        </p>
      ))}
    </div>
  );
}
