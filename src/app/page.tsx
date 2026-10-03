import { redirect } from "next/navigation";
import { latestMonth } from "@/lib/report";

export default function Home() {
  redirect(`/report/${latestMonth()}`);
}
