"use client";
import { useRouter } from "next/navigation";
import { developerLogout } from "@/lib/api";

export default function Navbar({ email }) {
  const router = useRouter();

  const handleLogout = async () => {
    await developerLogout();
    router.push("/login");
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
      <span className="text-white font-semibold text-lg">AuthPlatform</span>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">{email}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}