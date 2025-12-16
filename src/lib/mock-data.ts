// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================

import type {
  AdminUser,
  Committee,
  CommitteeMember,
  Contribution,
  LandDonor,
  GalleryImage,
  DashboardStats,
  ActivityLog,
  SiteSettings,
} from './types';

export const mockUser: AdminUser = {
  id: 1,
  email: 'admin@amanat.org',
  name: 'Admin User',
  role: 'super_admin',
  avatar: '/avatar.jpg',
  lastLogin: '2024-12-15T10:30:00Z',
  isActive: true,
};

export const mockStats: DashboardStats = {
  totalFunds: 2500000,
  landDonated: 15,
  totalContributors: 342,
  pendingContributions: 12,
  monthlyGrowth: 8.5,
  totalCommittees: 4,
  galleryImages: 48,
};

export const mockContributions: Contribution[] = [
  { id: 1, contributorName: 'Md. Abdul Karim', type: 'Cash', amount: 50000, date: '2024-12-10', anonymous: false, purpose: 'General Fund', status: 'verified', receiptNumber: 'REC-001' },
  { id: 2, contributorName: 'Anonymous', type: 'Land', amount: 500000, date: '2024-12-08', anonymous: true, purpose: 'Land Acquisition', status: 'pending' },
  { id: 3, contributorName: 'Mst. Ayesha Begum', type: 'Cash', amount: 25000, date: '2024-12-05', anonymous: false, purpose: 'Construction', status: 'verified', receiptNumber: 'REC-002' },
  { id: 4, contributorName: 'Md. Rafiqul Islam', type: 'Material', amount: 75000, date: '2024-12-01', anonymous: false, purpose: 'Building Materials', status: 'verified', receiptNumber: 'REC-003' },
  { id: 5, contributorName: 'Anonymous', type: 'Cash', amount: 100000, date: '2024-11-28', anonymous: true, purpose: 'General Fund', status: 'pending' },
  { id: 6, contributorName: 'Md. Jahangir Alam', type: 'Cash', amount: 35000, date: '2024-11-25', anonymous: false, purpose: 'Foundation Work', status: 'verified' },
  { id: 7, contributorName: 'Mst. Fatema Khatun', type: 'Cash', amount: 20000, date: '2024-11-20', anonymous: false, purpose: 'General Fund', status: 'rejected', notes: 'Duplicate entry' },
  { id: 8, contributorName: 'Md. Habibur Rahman', type: 'Material', amount: 45000, date: '2024-11-15', anonymous: false, purpose: 'Cement & Bricks', status: 'verified' },
];

export const mockMembers: CommitteeMember[] = [
  { id: 1, name: 'Md. Aminul Islam', designation: 'president', designationLabel: 'President', photo: '/member1.jpg', phone: '+880 1XXX-XXXXXX', email: 'president@amanat.org', bio: 'Leading with vision since 2024.', committeeId: 4, order: 1 },
  { id: 2, name: 'Md. Shamsul Haque', designation: 'vice-president', designationLabel: 'Vice President', photo: '/member2.jpg', phone: '+880 1XXX-XXXXXX', bio: 'Supporting leadership initiatives.', committeeId: 4, order: 2 },
  { id: 3, name: 'Md. Kamal Uddin', designation: 'secretary', designationLabel: 'Secretary', photo: '/member3.jpg', phone: '+880 1XXX-XXXXXX', email: 'secretary@amanat.org', bio: 'Managing documentation.', committeeId: 4, order: 3 },
  { id: 4, name: 'Md. Rafiqul Hasan', designation: 'treasurer', designationLabel: 'Treasurer', photo: '/member4.jpg', phone: '+880 1XXX-XXXXXX', bio: 'Financial transparency.', committeeId: 4, order: 4 },
  { id: 5, name: 'Mst. Nasima Begum', designation: 'member', designationLabel: 'Executive Member', photo: '/member5.jpg', bio: 'Community welfare.', committeeId: 4, order: 5 },
];

export const mockCommittees: Committee[] = [
  { id: 1, name: 'Founding Committee', term: '2018-2020', description: 'Established the foundation', image: '/committee1.jpg', type: 'past', members: [], isActive: false },
  { id: 2, name: 'Development Committee', term: '2020-2022', description: 'Construction planning', image: '/committee2.jpg', type: 'past', members: [], isActive: false },
  { id: 3, name: 'Construction Committee', term: '2022-2024', description: 'Managed construction', image: '/committee3.jpg', type: 'past', members: [], isActive: false },
  { id: 4, name: 'Current Committee', term: '2024-Present', description: 'Finalizing construction', image: '/committee4.jpg', type: 'current', members: mockMembers, isActive: true },
];

export const mockLandDonors: LandDonor[] = [
  { id: 1, name: 'Md. Abdul Rahman', landAmount: 5, landType: 'Agricultural', location: 'Plot A, Nazirpara', quote: 'This land is for the service of Allah.', date: '2021-11-15', documentNumber: 'DOC-001', verified: true },
  { id: 2, name: 'Md. Shafikul Islam', landAmount: 4, landType: 'Agricultural', location: 'Plot B, Nazirpara', quote: 'Our community needed this.', date: '2021-12-10', documentNumber: 'DOC-002', verified: true },
  { id: 3, name: 'Mst. Halima Khatun', landAmount: 3, landType: 'Agricultural', location: 'Plot C, Nazirpara', quote: 'In memory of my late husband.', date: '2022-01-05', documentNumber: 'DOC-003', verified: true },
  { id: 4, name: 'Md. Rafiqul Hasan', landAmount: 3, landType: 'Residential', location: 'Plot D, Nazirpara', date: '2022-02-20', documentNumber: 'DOC-004', verified: false },
];

export const mockGallery: GalleryImage[] = [
  { id: 1, url: '/gallery/foundation-1.jpg', category: 'Foundation', alt: 'Foundation laying ceremony', description: 'Historic moment', date: 'January 2022', featured: true, order: 1 },
  { id: 2, url: '/gallery/construction-1.jpg', category: 'Construction', alt: 'Wall construction', description: 'Progress on walls', date: 'March 2022', featured: false, order: 2 },
  { id: 3, url: '/gallery/event-1.jpg', category: 'Events', alt: 'Fundraising dinner', description: 'Community gathering', date: 'April 2022', featured: true, order: 3 },
  { id: 4, url: '/gallery/final-1.jpg', category: 'Final Look', alt: 'Completed mosque', description: 'Our beautiful mosque', date: 'December 2024', featured: true, order: 4 },
  { id: 5, url: '/gallery/ceremony-1.jpg', category: 'Ceremony', alt: 'Land donation ceremony', description: 'Honoring donors', date: 'November 2021', featured: false, order: 5 },
];

export const mockActivity: ActivityLog[] = [
  { id: 1, action: 'Created contribution', type: 'contribution', entityId: 1, user: 'Admin', details: 'Added ৳50,000 from Md. Abdul Karim', timestamp: '2024-12-10T09:00:00Z' },
  { id: 2, action: 'Verified contribution', type: 'contribution', entityId: 1, user: 'Admin', details: 'Verified #1', timestamp: '2024-12-10T09:15:00Z' },
  { id: 3, action: 'Updated gallery', type: 'gallery', entityId: 4, user: 'Admin', details: 'Marked as featured', timestamp: '2024-12-09T14:30:00Z' },
  { id: 4, action: 'Added member', type: 'committee', entityId: 4, user: 'Admin', details: 'Added Mst. Nasima Begum', timestamp: '2024-12-08T11:00:00Z' },
  { id: 5, action: 'Updated settings', type: 'settings', entityId: 1, user: 'Admin', details: 'Updated contact info', timestamp: '2024-12-07T16:45:00Z' },
];

export const mockSettings: SiteSettings = {
  siteName: 'Amanat-E-Nazirpara',
  tagline: 'Building Faith, Serving Community',
  description: 'A community-driven mosque project in Nazirpara, bringing together neighbors to build a place of worship.',
  phone: '+880 1XXX-XXXXXX',
  email: 'contact@amanat.org',
  address: 'Nazirpara, Bangladesh',
  socialLinks: { facebook: 'https://facebook.com/amanat', youtube: 'https://youtube.com/@amanat' },
  prayerTimes: { fajr: '5:30 AM', dhuhr: '12:30 PM', asr: '4:00 PM', maghrib: '6:00 PM', isha: '8:00 PM' },
  maintenanceMode: false,
  showAnonymousDonors: true,
  enableGallery: true,
};

export const mockChartData = [
  { month: 'Jan', amount: 120000 },
  { month: 'Feb', amount: 180000 },
  { month: 'Mar', amount: 150000 },
  { month: 'Apr', amount: 220000 },
  { month: 'May', amount: 280000 },
  { month: 'Jun', amount: 350000 },
  { month: 'Jul', amount: 300000 },
  { month: 'Aug', amount: 420000 },
  { month: 'Sep', amount: 380000 },
  { month: 'Oct', amount: 450000 },
  { month: 'Nov', amount: 520000 },
  { month: 'Dec', amount: 630000 },
];

export const mockUsers: AdminUser[] = [
  { id: 1, email: 'admin@amanat.org', name: 'Admin User', role: 'super_admin', isActive: true, lastLogin: '2024-12-15T10:30:00Z', phone: '+880 1XXX-XXXXXX' },
  { id: 2, email: 'editor@amanat.org', name: 'Editor User', role: 'editor', isActive: true, lastLogin: '2024-12-14T08:00:00Z', phone: '+880 1XXX-XXXXXX' },
  { id: 3, email: 'staff@amanat.org', name: 'Staff User', role: 'admin', isActive: false, lastLogin: '2024-12-10T15:20:00Z' },
];
