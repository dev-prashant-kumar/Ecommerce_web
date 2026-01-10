import { Button } from "@/components/ui/button";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";

export default async function Home() {
  const categories = await sanityFetch({
    query: groq`*[_type == "category"]`
  })

  console.log(categories);
  return (
    <div
      className="bg-white text-2xl
    "
    >
      <h1>hello world</h1>
      <Button>click me</Button>
      <Button variant={"link"}>click me</Button>
      <Button>click me</Button>
    </div>
  );
}
