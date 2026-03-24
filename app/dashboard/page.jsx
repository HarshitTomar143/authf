"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AppCard from "@/components/AppCard";
import { developerMe, listApps } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [developer, setDeveloper] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const devData = await developerMe();
        setDeveloper(devData.developer);
        const appsData = await listApps();
        setApps(appsData.apps);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar email={developer?.email} />
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