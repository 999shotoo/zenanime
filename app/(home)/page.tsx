import { fetchAnimePopular } from "@/actions/fetch/fetchpopular";
import { FetchTrending } from "@/actions/fetch/fetchtrending";
import Carousal from "@/components/home/carousal";

export default async function Home() {
  const trending = await FetchTrending();
  const popularAnime = await fetchAnimePopular(1);
  return (
    <>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Carousal data={trending.results} />
        <div>
          <h2 className="text-3xl font-bold py-4">Popular Anime</h2>
        </div>
      </div>
    </>
  );
}
