import React from "react";

interface TableProps {
  contentList: string[];
  name: string;
  report_date: string;
  pageNumber: number;
  total: number;
}

const TableOfContents = ({
  contentList,
  name,
  report_date,
  pageNumber,
  total,
}: TableProps) => {
  return (
    <div className="bg-white px-[48px] pt-[72px]">
      <h1 className="mb-12 text-black text-2xl font-semibold font-['Montserrat'] leading-normal tracking-tight">
        Table of Contents
      </h1>
      <div className="mb-[420px]">
        <ol>
          {contentList.map((item, index) => (
            <li
              key={index}
              className="pl-2 mb-4 text-black text-xl leading-normal tracking-tight"
            >
              <span>
                {index + 1}. {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex justify-between items-center text-[7px] text-gray-600">
        <p>
          {name} | {report_date}
        </p>
        <p className="font-bold">
          {pageNumber}/{total}
        </p>
      </div>
    </div>
  );
};

export default TableOfContents;
