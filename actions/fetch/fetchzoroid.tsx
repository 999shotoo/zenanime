"use server";

export async function fetchZoroId(id: string) {
  try {
    // Fetch data from the API
    const response = await fetch(`${process.env.MAL_SYNC_URL}/mal/anime/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch from API");
    }

    const data = await response.json();

    // Extract the Zoro site ID
    const zoroSite = data.Sites.Zoro;
    if (zoroSite) {
      const zoroKey = Object.keys(zoroSite)[0]; // Get the first key (ID)
      const zoroUrl = zoroSite[zoroKey].url; // Get the URL
      const fullZoroId = zoroUrl.split("/").pop(); // Extract the ID from the URL
      return fullZoroId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
