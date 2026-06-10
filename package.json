import { getLatestEdition } from "@/lib/kv";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let edition = null;
  try { edition = await getLatestEdition(); } catch {}
  return <Dashboard edition={edition} />;
}
