"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Table,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Data Grid", icon: Table, href: "/dashboard/grid" },
  { label: "Rules", icon: Settings, href: "/dashboard/rules" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-60 border-r bg-white shadow-sm py-10">
      <nav className="flex flex-col gap-3 px-4">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-6 h-6 text-purple-700" />
              <span className="text-lg font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
