import HomeCarousel from "@/components/home/carousal";

export default function Home() {
  return (
    <>
      <div>
        <HomeCarousel />
        <div className="flex flex-col lg:flex-row gap-6">
          {/* <div className="flex-1">
            <AnimeGrid />
          </div> */}
        </div>
      </div>
    </>
  );
}
