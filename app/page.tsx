import HomeCarousel from "@/components/home/carousal";
import HomePopularSection from "@/components/home/popularsection";

export default async function Home() {
  return (
    <>
      <div>
        <HomeCarousel />
        <div>
          <HomePopularSection />
        </div>
      </div>
    </>
  );
}
