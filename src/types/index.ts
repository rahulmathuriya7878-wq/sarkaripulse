export type JobCategory =
  | 'UPSC'
  | 'SSC'
  | 'Banking'
  | 'Railways'
  | 'Defense'
  | 'State PSC'
  | 'Teaching'
  | 'PSU'
  | 'Medical';

export type AlertType =
  | 'Vacancy Alert'
  | 'Admit Card'
  | 'Exam Date'
  | 'Result'
  | 'Answer Key'
  | 'Syllabus Update';

export interface JobAlert {
  id: string;
  title: string;
  organization: string;
  category: JobCategory;
  type: AlertType;
  totalPosts: string | number;
  qualification: string;
  ageLimit: string;
  salaryScale: string;
  importantDates: {
    applicationStart: string;
    applicationEnd: string;
    examDate?: string;
    admitCardDate?: string;
  };
  applicationFee: string;
  location: string;
  officialUrl: string;
  applyUrl: string;
  description: string;
  examPattern: string[];
  syllabusHighlights: string[];
  isUrgent: boolean;
  isTrending: boolean;
  publishedAt: string;
}

export type NewsCategory =
  | 'Recruitment Policy'
  | 'Current Affairs'
  | 'Exam Pattern Update'
  | 'Salary & DA News'
  | 'Syllabus Change';

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
}

export type BlogCategory =
  | 'Job Notification'
  | 'Exam Strategy & Prep'
  | 'Syllabus Breakdown'
  | 'Salary & DA Analysis'
  | 'Current Affairs'
  | 'Result & Cutoff';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
  editorReply?: string;
}

export interface OfficialWebsiteInfo {
  name: string;
  url: string;
  portalDescription?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: BlogCategory;
  jobCategory?: JobCategory;
  author: BlogAuthor;
  publishedAt: string;
  readTime: string;
  viewsCount: number;
  likesCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  summary: string;
  keyTakeaways: string[];
  contentHtml: string;
  faqs: { question: string; answer: string }[];
  comments: BlogComment[];
  tags: string[];
  targetJobId?: string;
  officialWebsite?: OfficialWebsiteInfo;
  officialUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: JobCategory | 'Blog News' | 'General News';
  type: AlertType | 'Blog Post' | 'System';
  timestamp: string;
  isRead: boolean;
  priority: 'High' | 'Medium' | 'Urgent';
  targetJobId?: string;
  targetBlogId?: string;
}

export interface NotificationPreferences {
  webPushEnabled: boolean;
  inAppToastsEnabled: boolean;
  emailAlertsEnabled: boolean;
  emailAddress: string;
  whatsAppAlertsEnabled: boolean;
  phoneNumber: string;
  subscribedCategories: JobCategory[];
  alertTypes: AlertType[];
  digestFrequency: 'Instant' | 'Daily Morning (8 AM)' | 'Daily Evening (8 PM)' | 'Weekly Digest';
  soundEnabled: boolean;
}

export interface CandidateProfile {
  age: number;
  qualification: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'PwBD';
  state: string;
  preferredSectors: JobCategory[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  examRelevance: string;
}

export interface EligibilityRecommendation {
  jobTitle: string;
  organization: string;
  matchPercentage: number;
  eligibilityStatus: string;
  keyReason: string;
  nextAction: string;
}

export interface EligibilityResult {
  eligibilityVerdict: string;
  ageRelaxationApplied: string;
  recommendations: EligibilityRecommendation[];
  preparationAdvice: string;
}
