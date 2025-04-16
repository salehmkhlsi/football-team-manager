// This is a Server Component - no "use client" directive
import { players } from "@/app/data/players";
import EditPlayerForm from "./EditForm";

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Get all player IDs for static path generation
  return players.map(player => ({
    id: player.id,
  }));
}

// Page component
export default function EditPlayerPage({ params }: { params: { id: string } }) {
  return <EditPlayerForm playerId={params.id} />;
} 