"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps{
    icon: LucideIcon;
    label: string;
    href: string;
}

const SidebarItem = ({icon,label, href}:SidebarItemProps) => {

    const pathname = usePathname();
    const router = useRouter();

    const isActive = (pathname === "/" && href=="/") ||
                        pathname === href ||
                        pathname?.startsWith(`${href}/`)

    const onClick = () => {
        router.push(href)
    }
    return ( 
    <button 
    onClick={onClick}
    type="button"
    className={cn(`flex items-center gap-x-2 text-zinc-500 
        text-sm font-[500] pl-6 transition-all hover:text-zinc-600
        hover:bg-zinc-300/20`,
    isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
    )
    }
    >
        <div className="flex items-center gap-x-2 py-4">
            {label}
        </div>
    </button>);
}
 
export default SidebarItem
