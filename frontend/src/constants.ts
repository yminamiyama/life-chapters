import { Category, Difficulty, ItemStatus, RiskLevel } from "./types";
import {
  Plane,
  Briefcase,
  Users,
  Wallet,
  Heart,
  BookOpen,
  MoreHorizontal,
  Star,
  Smile,
  Globe,
} from "lucide-react";

export const CATEGORY_CONFIG = {
  [Category.LEISURE]: {
    label: "レジャー・旅行",
    icon: Plane,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  [Category.CAREER]: {
    label: "キャリア",
    icon: Briefcase,
    color: "text-slate-500",
    bg: "bg-slate-100",
  },
  [Category.RELATIONSHIPS]: {
    label: "人間関係・家族",
    icon: Users,
    color: "text-pink-500",
    bg: "bg-pink-100",
  },
  [Category.FINANCE]: {
    label: "資産・お金",
    icon: Wallet,
    color: "text-green-500",
    bg: "bg-green-100",
  },
  [Category.HEALTH]: {
    label: "健康",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-100",
  },
  [Category.LEARNING]: {
    label: "学び",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-100",
  },
  [Category.PERSONAL_GROWTH]: {
    label: "自己成長",
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-100",
  },
  [Category.HOBBIES]: {
    label: "趣味",
    icon: Smile,
    color: "text-orange-500",
    bg: "bg-orange-100",
  },
  [Category.CONTRIBUTION]: {
    label: "貢献",
    icon: Globe,
    color: "text-teal-500",
    bg: "bg-teal-100",
  },
  [Category.OTHER]: {
    label: "その他",
    icon: MoreHorizontal,
    color: "text-gray-500",
    bg: "bg-gray-100",
  },
};

export const STATUS_CONFIG = {
  [ItemStatus.PLANNED]: { label: "計画中", color: "bg-slate-200 text-slate-700" },
  [ItemStatus.IN_PROGRESS]: { label: "実行中", color: "bg-blue-100 text-blue-700" },
  [ItemStatus.DONE]: { label: "完了", color: "bg-green-100 text-green-700" },
};

export const RISK_CONFIG = {
  [RiskLevel.LOW]: { label: "低リスク", color: "text-green-600" },
  [RiskLevel.MEDIUM]: { label: "中リスク", color: "text-yellow-600" },
  [RiskLevel.HIGH]: { label: "高リスク", color: "text-red-600" },
};

export const DIFFICULTY_CONFIG = {
  [Difficulty.LOW]: { label: "易しい", color: "text-green-600" },
  [Difficulty.MEDIUM]: { label: "普通", color: "text-yellow-600" },
  [Difficulty.HIGH]: { label: "難しい", color: "text-red-600" },
};
