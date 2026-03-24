"use client";
import { useState } from "react";
import { updateProviders } from "@/lib/api";

export default function AppCard({ app }) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    redirectUrl: app.redirectUrl || "",
    googleClientId: app.googleClientId || "",
    googleClientSecret: "",
    googleRedirectUri: app.googleRedirectUri || "",
    githubClientId: app.githubClientId || "",
    githubClientSecret: "",
    githubRedirectUri: app.githubRedirectUri || "",
  });

  const copyClientId = () => {
    navigator.clipboard.writeText(app.clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await updateProviders(app.id, form);
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{app.name}</h3>
          <span className="text-xs text-gray-500">
            {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Client ID</p>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
            <code className="text-sm text-green-400 flex-1 truncate">{app.clientId}</code>
            <button
              onClick={copyClientId}
              className="text-xs text-gray-400 hover:text-white transition shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Post-Login Redirect</p>
          <p className="text-sm text-gray-300 bg-gray-800 rounded-lg px-3 py-2 truncate">
            {app.redirectUrl}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            {app.googleClientId && (
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">
                Google
              </span>
            )}
            {app.githubClientId && (
              <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded-full">
                GitHub
              </span>
            )}
            {!app.googleClientId && !app.githubClientId && (
              <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                Local auth only
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
          >
            Configure
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">Configure — {app.name}</h2>
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="text-gray-500 hover:text-white transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Post-login redirect */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Post-Login Redirect URL</p>
                <p className="text-xs text-gray-500">Where users land after successful login</p>
                <input
                  name="redirectUrl"
                  value={form.redirectUrl}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="https://yourapp.com/dashboard"
                />
              </div>

              {/* Google */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Google OAuth
                </p>

                {/* Current saved values */}
                {(app.googleClientId || app.googleRedirectUri) && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Currently saved</p>
                    {app.googleClientId && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Client ID</p>
                        <code className="text-xs text-blue-400 break-all">{app.googleClientId}</code>
                      </div>
                    )}
                    {app.googleRedirectUri && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Callback URL</p>
                        <code className="text-xs text-blue-400 break-all">{app.googleRedirectUri}</code>
                      </div>
                    )}
                    {!app.googleClientId && !app.googleRedirectUri && (
                      <p className="text-xs text-gray-600">Not configured yet</p>
                    )}
                  </div>
                )}

                <input
                  name="googleClientId"
                  value={form.googleClientId}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="Google Client ID"
                />
                <input
                  name="googleClientSecret"
                  value={form.googleClientSecret}
                  onChange={handleChange}
                  type="password"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="Google Client Secret (leave blank to keep existing)"
                />
                <input
                  name="googleRedirectUri"
                  value={form.googleRedirectUri}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="http://localhost:8080/auth/google/callback"
                />
              </div>

              {/* GitHub */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  GitHub OAuth
                </p>

                {/* Current saved values */}
                {(app.githubClientId || app.githubRedirectUri) && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Currently saved</p>
                    {app.githubClientId && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Client ID</p>
                        <code className="text-xs text-purple-400 break-all">{app.githubClientId}</code>
                      </div>
                    )}
                    {app.githubRedirectUri && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Callback URL</p>
                        <code className="text-xs text-purple-400 break-all">{app.githubRedirectUri}</code>
                      </div>
                    )}
                    {!app.githubClientId && !app.githubRedirectUri && (
                      <p className="text-xs text-gray-600">Not configured yet</p>
                    )}
                  </div>
                )}

                <input
                  name="githubClientId"
                  value={form.githubClientId}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="GitHub Client ID"
                />
                <input
                  name="githubClientSecret"
                  value={form.githubClientSecret}
                  onChange={handleChange}
                  type="password"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="GitHub Client Secret (leave blank to keep existing)"
                />
                <input
                  name="githubRedirectUri"
                  value={form.githubRedirectUri}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="http://localhost:8080/auth/github/callback"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex gap-3 justify-end">
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
              >
                {loading ? "Saving..." : success ? "Saved ✓" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}