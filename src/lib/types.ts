// ============================================
// ADMIN PANEL TYPES & INTERFACES
// ============================================

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication
export interface AdminUser extends BaseEntity {
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  isActive: boolean;
}

// Committee
export interface CommitteeMember extends BaseEntity {
  name: string;
  designation: 'president' | 'vice-president' | 'secretary' | 'treasurer' | 'member';
  designationLabel: string;
  photo: string;
  phone?: string;
  email?: string;
  bio?: string;
  committeeId: number;
  order: number;
}

export interface Committee extends BaseEntity {
  name: string;
  term: string;
  description: string;
  image: string;
  type: 'past' | 'current';
  members: CommitteeMember[];
  isActive: boolean;
}

// Contributions
export interface Contribution extends BaseEntity {
  contributorName: string;
  type: 'Cash' | 'Land' | 'Material';
  amount: number;
  date: string;
  anonymous: boolean;
  purpose?: string;
  notes?: string;
  receiptNumber?: string;
  status: 'pending' | 'verified' | 'rejected';
}

// Land Donors
export interface LandDonor extends BaseEntity {
  name: string;
  landAmount: number;
  landType: 'Agricultural' | 'Residential';
  location: string;
  quote?: string;
  date: string;
  documentNumber?: string;
  notes?: string;
  verified: boolean;
  photo?: string;
}

// Gallery
export interface GalleryImage extends BaseEntity {
  url: string;
  category: 'Foundation' | 'Construction' | 'Events' | 'Final Look' | 'Ceremony';
  alt: string;
  description?: string;
  date?: string;
  featured: boolean;
  order: number;
}

// Statistics
export interface DashboardStats {
  totalFunds: number;
  landDonated: number;
  totalContributors: number;
  pendingContributions: number;
  monthlyGrowth: number;
  totalCommittees: number;
  galleryImages: number;
}

// Activity
export interface ActivityLog extends BaseEntity {
  action: string;
  type: 'contribution' | 'committee' | 'gallery' | 'settings' | 'user' | 'delete';
  entityId?: number;
  user: string;
  timestamp: string;
  details?: string;
}

// Settings
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  prayerTimes: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  logo?: string;
  favicon?: string;
  maintenanceMode: boolean;
  showAnonymousDonors: boolean;
  enableGallery: boolean;
}

// Table
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

// Notification
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
