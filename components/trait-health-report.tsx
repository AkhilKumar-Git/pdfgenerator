"use client";

import Image from "next/image";

interface ReportProps {
  name: string;
  age: number;
  gender: string;
  sample_types: string;
  test_date: string;
  report_date: string;
}

interface PersonalInfo {
  personal_info: ReportProps;
  pageNumber: number;
  total: number;
}

export function TraitHealthReportComponent({
  personal_info,
  pageNumber,
  total,
}: PersonalInfo) {
  return (
    <div className="bg-white px-[48px] pt-[96px]">
      <Image
        src="/trait_logo.svg"
        alt="Trait Health Logo"
        width={150}
        height={80}
        className="mb-20"
      />

      <h1 className="text-[14px] font-bold mb-4 leading-[16.8px] tracking-wide ">
        Dear {personal_info.name},
      </h1>

      <p className="text-sm mb-[60px] leading-[14.4px] tracking-wide opacity-50">
        The information on this report is for educational and informational use
        only. The information is not intended to be used by the customer for any
        diagnostic purpose and is not a substitute for professional medical
        advice. You should always seek the advice of your physician or other
        healthcare providers with any questions you may have regarding
        diagnosis, cure, treatment, mitigation, or prevention of any disease or
        other medical condition or impairment or the status of your health.
      </p>

      <hr className="my-[80px]" />

      <h2 className="h-10 text-black text-xl font-semibold font-['Montserrat'] leading-tight tracking-tight">
        About your raw data
      </h2>

      <div className="text-[11px] leading-[13.2px] mb-[200px]">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="opacity-50">Name:</span>
            <span>{personal_info.name}</span>
          </div>
          <hr className="my-1" />

          <div className="flex justify-between">
            <span className="opacity-50">Age:</span>
            <span>{personal_info.age}</span>
          </div>
          <hr className="my-1" />

          <div className="flex justify-between">
            <span className="opacity-50">Gender:</span>
            <span>{personal_info.gender}</span>
          </div>
          <hr className="my-1" />

          <div className="flex justify-between">
            <span className="opacity-50">Type of biomaterial:</span>
            <span>
              {Array.isArray(personal_info.sample_types)
                ? personal_info.sample_types.join(", ")
                : personal_info.sample_types}
            </span>
          </div>
          <hr className="my-1" />

          <div className="flex justify-between">
            <span className="opacity-50">Sample Collection date:</span>
            <span>{personal_info.test_date}</span>
          </div>
          <hr className="my-1" />

          <div className="flex justify-between">
            <span className="opacity-50">Report preparation date:</span>
            <span>{personal_info.report_date}</span>
          </div>
          <hr className="my-1" />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[7px] text-gray-600">
        <p>
          {personal_info.name} | {personal_info.report_date}
        </p>
        <p className="font-bold">
          {pageNumber}/{total}
        </p>
      </div>
    </div>
  );
}
