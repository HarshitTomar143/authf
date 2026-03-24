import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/NavBar";
import AppCard from "../../components/AppCard";

async function getDeveloper() {
  const cookieStore = await cookies();
  const cookie = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/developer/me`, {
    headers: { Cookie: cookie },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}


async function getApps() {
  const cookieStore = await cookies();
  const cookie = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/list`, {
    headers: { Cookie: cookie },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.apps;
}


export default async function DashboardPage() {
  const developerData = await getDeveloper();

  if (!developerData) redirect("/login");

  const apps = await getApps();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar email={developerData.developer.email} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Applications</h1>
            <p className="text-gray-400 text-sm mt-1">
              {apps.length} app{apps.length !== 1 ? "s" : ""} registered
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            + New App
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 text-sm">No applications yet</p>
            <Link
              href="/dashboard/create"
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
            >
              Create your first app →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}