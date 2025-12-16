// ============================================
// ADMIN PANEL CONSTANTS
// ============================================

export const ROUTES = {
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  CONTRIBUTIONS: '/dashboard/contributions',
  COMMITTEES: '/dashboard/committees',
  GALLERY: '/dashboard/gallery',
  LAND_DONORS: '/dashboard/land-donors',
  USERS: '/dashboard/users',
  SETTINGS: '/dashboard/settings',
  ACTIVITY: '/dashboard/activity',
} as const;

export const CONTRIBUTION_TYPES = [
  { value: 'Cash', label: 'Cash', color: 'emerald' },
  { value: 'Land', label: 'Land', color: 'amber' },
  { value: 'Material', label: 'Material', color: 'blue' },
] as const;

export const CONTRIBUTION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

export const DESIGNATIONS = [
  { value: 'president', label: 'President' },
  { value: 'vice-president', label: 'Vice President' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'member', label: 'Executive Member' },
] as const;

export const GALLERY_CATEGORIES = [
  { value: 'Foundation', label: 'Foundation' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Events', label: 'Events' },
  { value: 'Final Look', label: 'Final Look' },
  { value: 'Ceremony', label: 'Ceremony' },
] as const;

export const USER_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
] as const;

export const NAV_ITEMS = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { name: 'Contributions', href: ROUTES.CONTRIBUTIONS, icon: 'HandCoins' },
  { name: 'Committees', href: ROUTES.COMMITTEES, icon: 'Users' },
  { name: 'Gallery', href: ROUTES.GALLERY, icon: 'Images' },
  { name: 'Land Donors', href: ROUTES.LAND_DONORS, icon: 'MapPin' },
  { name: 'Users', href: ROUTES.USERS, icon: 'UserCog' },
  { name: 'Activity', href: ROUTES.ACTIVITY, icon: 'Activity' },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: 'Settings' },
] as const;
