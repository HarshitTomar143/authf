"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createApp } from "@/lib/api";

export default function CreateAppPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await createApp(name, redirectUrl);
      setCreated(data.app);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show credentials after creation
  if (created) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <h2 className="text-white font-semibold text-lg">App created</h2>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs px-4 py-3 rounded-lg">
              Save your Client Secret now — it will never be shown again.
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">App Name</p>
                <p className="text-sm text-white bg-gray-800 px-3 py-2 rounded-lg">{created.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Client ID</p>
                <code className="block text-sm text-green-400 bg-gray-800 px-3 py-2 rounded-lg break-all">
                  {created.clientId}
                </code>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Client Secret</p>
                <code className="block text-sm text-red-400 bg-gray-800 px-3 py-2 rounded-lg break-all">
                  {created.clientSecret}
                </code>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-white text-sm transition">
            ← Back
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create Application</h1>
          <p className="text-gray-400 text-sm mt-1">Register a new app to get your credentials</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">App Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              placeholder="My Awesome App"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Redirect URL</label>
            <input
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              placeholder="https://yourapp.com/dashboard"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            {loading ? "Creating..." : "Create Application"}
          </button>
        </form>
      </div>
    </div>
  );
}