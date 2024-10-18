import { TraitHealthReportComponent } from "@/components/trait-health-report";

export default async function PersonDetails() {
  const data = {
    name: "Akhil",
    age: 25,
    gender: "Male",
    biomaterial: "Blood",
    sampleCollectionDate: "2023-10-01",
    reportPreparationDate: "2023-10-05",
  };

  return (
    <div>
      <TraitHealthReportComponent
        name={data.name}
        age={data.age}
        gender={data.gender}
        biomaterial={data.biomaterial}
        sampleCollectionDate={data.sampleCollectionDate} // Corrected key
        reportPreparationDate={data.reportPreparationDate} // Corrected key
      />
    </div>
  );
}
