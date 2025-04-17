import { players } from "@/app/data";
import { Metadata } from "next";
import AddEvaluationClient from "./AddEvaluationClient";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const player = players.find(player => player.id === params.id);
  return {
    title: player ? `ثبت ارزیابی جدید: ${player.name} | مدیریت تیم فوتبال` : "بازیکن یافت نشد",
  };
}

// Generate static params for the page
export async function generateStaticParams() {
  return players.map(player => ({
    id: player.id,
  }));
}

// Server component that renders the client component
export default function AddEvaluationPage() {
  return <AddEvaluationClient />;
}
