import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, FileText, History, Calendar, CheckSquare, Users } from 'lucide-react';
import AppLogo from './app-logo';

// Applicant menu items
const applicantNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/beranda',
        icon: Home,
    },
    {
        title: 'Peminjaman',
        href: '/peminjaman',
        icon: FileText,
    },
    {
        title: 'Riwayat',
        href: '/riwayat',
        icon: History,
    },
    {
        title: 'Kalender',
        href: '/kalender',
        icon: Calendar,
    },
];

// SCO menu items
const scoNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/sco/beranda',
        icon: Home,
    },
    {
        title: 'Kalender',
        href: '/kalender',
        icon: Calendar,
    },
];

// WD menu items
const wdNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/wd/beranda',
        icon: Home,
    },
    {
        title: 'Kalender',
        href: '/kalender',
        icon: Calendar,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role || 'APP';

    // Select menu items based on user role
    let mainNavItems: NavItem[] = applicantNavItems;
    if (userRole === 'SCO') {
        mainNavItems = scoNavItems;
    } else if (userRole === 'WD') {
        mainNavItems = wdNavItems;
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-border/40">
            <SidebarHeader className="border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild
                            className="hover:bg-accent/50 transition-all duration-300"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border/40 bg-gradient-to-t from-background to-muted/20">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
