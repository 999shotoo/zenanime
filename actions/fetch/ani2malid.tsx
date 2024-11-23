"use server";

export async function Ani2MalId(malId: string) {
  const query = `
        query($id: Int, $type: MediaType) {
            Media(idMal: $id, type: $type) {
                id
                siteUrl
            }
        }
    `;

  const variables = {
    id: malId,
    type: "ANIME",
  };

  const response = await fetch(`${process.env.ANILIST_GRAPHQL_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  return data.data.Media.id;
}
