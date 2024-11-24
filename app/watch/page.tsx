import { fetchInfo } from "@/actions/fetch/fetchinfo";
import { redirect } from "next/navigation";

export default async function Watch({
  searchParams,
}: {
  searchParams: { id: string; ep: string };
}) {
  const params = await searchParams;
  if (!params.ep) {
    redirect(`/watch?id=${params.id}&ep=1`);
  }
  const animeinfo = await fetchInfo(params.id);
  if (!animeinfo) {
    return <div>Not Found</div>;
  }

  return (
    <>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h2 className="text-3xl font-bold py-4">Watch</h2>
      </div>
    </>
  );
}
