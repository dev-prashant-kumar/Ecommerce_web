import { Button } from "@/components/ui/button";

export default function Home() {
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
