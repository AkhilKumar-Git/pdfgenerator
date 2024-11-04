import Image from "next/image";
import React, { ReactNode } from "react";

interface contentProps {
  title: string;
  content: ReactNode;
}

interface MicrobiomeProps {
  name: string;
  report_date: string;
  pageNumber: number;
  total: number;
  image_url: string;
  static_text: contentProps;
}

const MicrobiomeStatic = ({
  name,
  report_date,
  pageNumber,
  total,
  image_url,
  static_text,
}: MicrobiomeProps) => {
  return (
    <div className="flex flex-col justify-between w-[210mm] bg-white px-[48px] pt-[72px]">
      <div className="relative mb-6">
        <Image
          src={image_url}
          alt="Microbes illustration"
          width={800}
          height={504}
          className="rounded-lg"
        />
      </div>
      <div className="flex-grow mb-[200px]">
        <h2 className="text-2xl font-bold mb-6">{static_text.title}</h2>
        {static_text.content}
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

export default MicrobiomeStatic;
