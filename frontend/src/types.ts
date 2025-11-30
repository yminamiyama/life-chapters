export enum Granularity {
  FIVE_YEARS = "5y",
  TEN_YEARS = "10y",
}

export enum Category {
  CAREER = "career",
  HEALTH = "health",
  FINANCE = "finance",
  RELATIONSHIPS = "relationships",
  LEARNING = "learning",
  LEISURE = "leisure",
  CONTRIBUTION = "contribution",
  PERSONAL_GROWTH = "personal_growth",
  HOBBIES = "hobbies",
  OTHER = "other",
}

export enum Difficulty {
  LOW = "easy",
  MEDIUM = "medium",
  HIGH = "hard",
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum ItemStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export interface BucketItem {
  id: string;
  timeBucketId: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  riskLevel: RiskLevel;
  costEstimate: number;
  status: ItemStatus;
  targetYear: number;
  valueStatement: string;
  description?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface TimeBucket {
  id: string;
  label: string;
  startAge: number;
  endAge: number;
  description?: string;
  position?: number;
  items: BucketItem[];
}

export interface UserProfile {
  id: string;
  email?: string;
  birthdate?: string;
  currentAge: number;
  timezone?: string;
}
