import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/courses", label: "Courses" },
  { href: "/dashboard/admin/finance", label: "Finance" },
  { href: "/dashboard/admin/sessions", label: "Sessions" },
  { href: "/dashboard/admin/reports", label: "Reports" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-full text-sm font-semibold border ${
              active
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent"
                : "bg-white text-slate-700 border-slate-200 hover:border-purple-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminNav;
