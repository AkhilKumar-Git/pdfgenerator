import React from "react";

interface listProps {
  title: string;
  items: string[];
}

export default function Disclaimer({ title, items }: listProps) {
  return (
    <div className="bg-white px-[48px] pt-[72px]">
      <h1 className="mb-12 text-black text-2xl font-semibold font-['Montserrat'] leading-normal tracking-tight">
        {title}
      </h1>
      <ol className="list-disc list-inside text-[10px]">
        {items.map(
          (
            item,
            index // Dynamic rendering of list items
          ) => (
            <li key={index}>{item}</li>
          )
        )}
      </ol>
    </div>
  );
}
