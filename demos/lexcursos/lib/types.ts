// Tipos da réplica (subconjunto de src/lib/types do original + os registros do banco que as telas usam).

export type UserRole = "admin" | "teacher" | "student" | "moderator";
export type UserStatus = "active" | "inactive" | "banned" | "pending";
export type LessonType = "video" | "text" | "pdf" | "download" | "audio" | "quiz" | "exercise" | "live";
export type ProductLevel = "beginner" | "intermediate" | "advanced" | "all";
export type ProductType = "course" | "bundle" | "subscription";
export type ProductStatus = "published" | "draft";
export type OrderStatus = "paid" | "pending" | "processing" | "failed" | "refunded" | "chargeback" | "cancelled";
export type PaymentMethod = "pix" | "credit_card" | "boleto";

export type UserKind = "cadastrado" | "aluno" | "assinante" | "encerrado" | "professor" | "equipe";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  phone?: string;
  location?: string;
  createdAgoMin: number; // criado há N minutos
  lastLoginAgoMin?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  price: number;
  comparePrice?: number;
  categoryName: string;
  level: ProductLevel;
  type: ProductType;
  status: ProductStatus;
  isPublic: boolean;
  isFeatured: boolean;
  enrolledCount: number;
  courseId: string | null;
  heroColor: string;
  createdAgoMin: number;
}

export interface LessonData {
  id: string;
  title: string;
  type: LessonType;
  status: "published" | "draft";
  duration: number | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  description: string | null;
  isFree: boolean;
  isPreview: boolean;
  completionCriteria: string;
  materials: { id: string; title: string }[];
}

export interface ModuleData {
  id: string;
  title: string;
  instructorId: string | null;
  coverImage: string | null;
  lessons: LessonData[];
}

/** Módulo dentro de um curso (ordem e publicação valem só neste curso). */
export interface CourseModuleLink {
  moduleId: string;
  isPublished: boolean;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  paymentMethod: PaymentMethod | null;
  total: number;
  discount: number;
  couponCode: string | null;
  status: OrderStatus;
  createdAgoMin: number;
  paidAgoMin: number | null;
  mpOrderId: string | null;
  mpStatusDetail: string | null;
}

export interface Enrollment {
  userId: string;
  productId: string;
  progress: number;
  status: "active" | "expired" | "cancelled" | "completed";
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usedCount: number;
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  agoMin: number;
}

export interface PlatformSettingsData {
  general: { name: string; tagline: string; supportEmail: string; currency: string };
  gamification: { xpEnabled: boolean; achievementsEnabled: boolean; rankingEnabled: boolean; streakEnabled: boolean; xpPerLesson: number; xpPerCourse: number };
  integrations: { googleAnalyticsId: string; metaPixelId: string; whatsappNumber: string };
  company: { legalName: string; cnpj: string; address: string; city: string; contactEmail: string; dpoName: string; dpoEmail: string };
  finance: { gatewayFeePercent: number; teacherCommissionPercent: number };
}
