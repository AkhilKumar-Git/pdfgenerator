import React from "react";

const TaxonomicLevel = ({
  level,
  index,
  totalLevels,
}: {
  level: string;
  index: number;
  totalLevels: number;
}) => (
  <div
    className={`py-2 px-4 text-center text-white font-bold mx-auto ${
      index === totalLevels - 1 ? "rounded-b-lg" : "rounded-bl-lg rounded-br-lg"
    }`}
    style={{
      background: `linear-gradient(to bottom, rgba(17, 37, 56, ${
        1 - index * 0.1
      }) 0%, rgba(17, 37, 56, ${1 - (index + 1) * 0.1}) 100%)`,
      width: `${100 - index * 5}%`,
    }}
  >
    {level}
  </div>
);

export default function Component() {
  const levels = [
    "KINGDOM",
    "PHYLUM",
    "CLASS",
    "ORDER",
    "FAMILY",
    "GENUS",
    "SPECIES",
    "STRAIN",
  ];
  const examples = [
    { category: "KINGDOM", homoSapiens: "Animalia", bacteroides: "Bacteria" },
    {
      category: "PHYLUM",
      homoSapiens: "Chordata",
      bacteroides: "Bacteroidetes",
    },
    { category: "CLASS", homoSapiens: "Mammalia", bacteroides: "Bacteroidia" },
    {
      category: "ORDER",
      homoSapiens: "Primates",
      bacteroides: "Bacteroidales",
    },
    {
      category: "FAMILY",
      homoSapiens: "Hominidae",
      bacteroides: "Bacteroidaceae",
    },
    { category: "GENUS", homoSapiens: "Homo", bacteroides: "Bacteroides" },
    {
      category: "SPECIES",
      homoSapiens: "Homo sapiens",
      bacteroides: "Bacteroides fragilis",
    },
    {
      category: "STRAIN",
      homoSapiens: "Caucasian",
      bacteroides: "gcf_000297735",
    },
  ];

  return (
    <div className="w-[210mm] max-h-[297mm] bg-white px-[48px] pt-[72px]">
      <h1 className="text-2xl mb-6 font-bold">Taxonomic Hierarchy</h1>
      <div className="space-y-1 mb-12">
        {levels.map((level, index) => (
          <TaxonomicLevel
            key={level}
            level={level}
            index={index}
            totalLevels={levels.length}
          />
        ))}
      </div>
      <h2 className="text-2xl mb-4 font-bold">Example</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div></div>
        <div className="text-[10px] font-bold">Homo sapiens</div>
        <div className="text-[10px] font-bold">Bacteroides fragilis</div>
        {examples.map((example) => (
          <React.Fragment key={example.category}>
            <div className="text-sm">{example.category}</div>
            <div className="text-sm">{example.homoSapiens}</div>
            <div className="text-sm">{example.bacteroides}</div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between items-center text-[7px] text-gray-600 mt-20">
        <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
        <p className="font-bold">24/41</p>
      </div>
    </div>
  );
}
