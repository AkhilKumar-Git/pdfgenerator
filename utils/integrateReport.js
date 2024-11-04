// utils/integrateReport.js

export const integrateReport = async () => {
  try {
    const response = await fetch("/api/sheets");
    if (!response.ok) {
      throw new Error("Failed to fetch data from /api/sheets");
    }

    const { dynamicData } = await response.json();
    return dynamicData;
  } catch (error) {
    console.error("Error fetching and integrating report:", error.message);
    return null;
  }
};
