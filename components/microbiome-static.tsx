import Image from "next/image";
import React from "react";

const MicrobiomeStatic = () => {
  return (
    <div className="flex flex-col justify-between w-[210mm] max-h-[297mm] bg-white px-[48px] pt-[72px]">
      <div className="relative mb-6">
        <Image
          src="/Intro.png"
          alt="Microbes illustration"
          width={800}
          height={504}
          className="rounded-lg"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6">Intro</h2>
        <p className="text-base text-[11px] leading-relaxed">
          Microbes are everywhere, they live in and on all animals and plants
          and they fill our oceans. Right now, they are on your phone, your
          hands (even if you wash them), in your drinking water (about a million
          per one milliliter!), in aerosols around you and present at any moment
          in time. In fact, the ecosystem of planet earth, which is composed of
          a multitude of habitats, contains different sets of microbes that are
          essential for proper ecosystem functioning. As the ecosystems of
          planet Earth have a series of habitats with specific organisms that
          are essential for proper ecosystem functioning, so does the human
          body. On a smaller scale, the human body is also an ecosystem, with
          different body sites providing different habitats for microbial
          communities. The microbial communities living in and on our body are
          collectively called the microbiome, and we have distinct microbiomes
          at each of our body sites.
        </p>
      </div>
      <div className="flex justify-between items-center text-[7px] text-gray-600">
        <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
        <p className="font-bold">24/41</p>
      </div>
    </div>
  );
};

export default MicrobiomeStatic;
