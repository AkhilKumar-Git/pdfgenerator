// utils/integrateReport.js

export const integrateReport = async () => {
  try {
    const response = await fetch("/api/sheets");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error: ${errorData.error || "Failed to fetch data from /api/sheets"}`
      );
    }

    const { dynamicData } = await response.json();
    return dynamicData;
  } catch (error) {
    console.error("Error fetching and integrating report:", error.message);
    return null;
  }
};
