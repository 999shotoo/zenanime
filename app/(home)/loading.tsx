import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <section className="relative h-[40vh] md:h-[50vh] rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            <Skeleton className="h-full w-full rounded-lg" />{" "}
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-background to-transparent">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />{" "}
            </div>
            <div className="flex space-x-4 mt-4">
              <Skeleton className="h-10 w-32 rounded-md" />{" "}
            </div>
          </div>
        </section>
        <div>
          <Skeleton className="h-8 w-[250px]" />
        </div>
      </div>
    </>
  );
}
