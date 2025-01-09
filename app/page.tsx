import AnimeCards from "@/components/animecard";
import HomeCarousel from "@/components/home/carousal";
import { SiderCard } from "@/components/home/sidecard";
import { PopularAnilist } from "@/lib/anilist/anilistapi";

export default async function Home() {
  const fetchpopular = await PopularAnilist();
  return (
    <>
      <div>
        <HomeCarousel />
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 py-8 gap-4">
          <AnimeCards data={fetchpopular || []} />
        </div>
      </div>
    </>
  );
}
