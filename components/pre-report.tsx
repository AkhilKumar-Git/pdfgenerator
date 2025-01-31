"use client";

import React from "react";

interface PreReportProps {
  name: string;
  report_date: string;
  pageNumber: number;
  total: number;
}

const PreReport = ({
  name,
  report_date,
  pageNumber,
  total,
}: PreReportProps) => {
  return (
    <div className="bg-white px-[48px] pt-[72px]">
      <h1 className="text-2xl font-medium leading-[24px] mb-8">
        Before looking at your results
      </h1>

      <div className="bg-gray-200 mb-8 rounded">
        <p className="text-sm font-medium p-4">
          This report is provided to you for informational and educational
          purposes only, and does not replace a visit to a physician, nor does
          it replace the advice or services of a physician.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <p className="mb-4 text-sm">
            Our blood and gut microbiome report is based on the latest
            scientific and medical knowledge available in respected scientific
            and medical journals. You can learn about your gut microbiome in
            different sections of the report.
          </p>

          <p className="text-sm">
            The human gut is inhabited by different microorganisms, mostly
            bacteria, but also fungi, viruses etc. Those microorganisms all
            together make up a gut microbiome. Most microorganisms in the gut
            are beneficial and play an important role in maintaining the
            body&apos;s health.
          </p>
          <p className="mb-4 text-sm">
            The diversity, richness and composition of the microbiome is
            essential for a healthy gut and also in maintaining a healthy state
            in the whole body. The gut microbiome community depends mainly on
            lifestyle and environmental factors. A long-termed absence or
            imbalanced quantity of certain bacteria can lead to different health
            problems like obesity, digestion problems and autoimmune diseases.
          </p>

          <p className="mb-4 text-sm">
            Our gut microbiome analysis allows us to study your gut bacteria -
            to identify, which bacteria live in your gut, how abundant they are
            and how they affect your body. The DNA of your bacteria is analyzed
            in the lab, using the latest technology to provide quick and
            accurate results. Microbiome analysis can show whether your
            nutrition and gut ecosystem are well balanced or if you need to make
            changes in diet to influence your bacterial composition and to
            improve your health.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm">
            Keep in mind, that only persistent healthy eating habits can lead
            you to an improved gut microbiome composition.
          </p>
          <h2 className="text-sm font-bold">Summary of the report</h2>
          <p className="text-sm">
            provides you with conclusive information about the test results.
            Estimates in the results report are based on a comparison of
            bacteria abundances with the percentiles calculated on the basis of
            the reference group.
          </p>
        </div>
      </div>
      <hr className="my-4" />

      <div className="text-[10px]">
        <p className="mb-2">
          It should be taken into consideration that the result of a microbiome
          test and its interpretation may be incomplete. The amount of detected
          microorganisms is not conclusive and other microorganisms that are not
          detected by this test may be present in the microbiome. The current
          interpretation of the microbiome test may be subject to change in the
          future due to the publication of new scientific studies. Any
          inaccurate or missing information, likewise any action that does not
          comply with the manual, may result in a misleading interpretation.
        </p>
        <p className="mb-4">
          This report is provided to you for informational and educational
          purposes only, and does not replace a visit to a physician, nor does
          it replace the advice or services of a physician.
        </p>
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

export default PreReport;
