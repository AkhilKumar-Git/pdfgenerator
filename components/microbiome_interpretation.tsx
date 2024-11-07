interface props {
  title: string;
  image: string;
  alt: string;
  list: listProps[];
}

interface listProps {
  name: string;
  subtitle: string;
  interpretation: string;
}

const Microbiome_interpretation = ({ title, image, alt, list }: props) => {
  return (
    <div className="bg-white px-[48px] pt-[72px]">
      <div className="section-blood-picture mb-12 break-inside-avoid-page">
        <h2 className="text-sm font-semibold mb-4">{title}</h2>
        <div className="mb-6 flex items-center">
          <img src={image} alt={alt} className="w-6 h-6 mr-2" />
        </div>
      </div>
      {/* Display incoming list here */}
      <ul className="list-disc pl-5">
        {list.map((item, index) => (
          <li key={index} className="mb-4">
            <strong className="text-[11px]">{item.name}</strong> &bull;{" "}
            <span className=" text-[11px] text-gray-600">{item.subtitle}</span>
            <p className="text-xs text-gray-500">{item.interpretation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Microbiome_interpretation;
