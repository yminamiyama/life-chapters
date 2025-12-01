"use client";

import React from "react";
import { CATEGORY_CONFIG } from "@/constants";
import { Category, ItemStatus, TimeBucket } from "@/types";
import { AlertCircle, CheckCircle2, Circle, Clock3 } from "lucide-react";

interface BucketCardProps {
  bucket: TimeBucket;
  isActive: boolean;
  temporalState: "past" | "current" | "future";
  onSelect: () => void;
}

const BucketCard: React.FC<BucketCardProps> = ({ bucket, isActive, temporalState, onSelect }) => {
  const itemCount = bucket.items.length;
  const completedCount = bucket.items.filter((i) => i.status === ItemStatus.DONE).length;
  const progress = itemCount > 0 ? (completedCount / itemCount) * 100 : 0;
  const categories = Array.from(new Set(bucket.items.map((i) => i.category))).slice(0, 4);

  const isCurrent = temporalState === "current";
  const isPast = temporalState === "past";

  const cardTone = (() => {
    if (isActive) return "border-brand-500 ring-1 ring-brand-500 bg-white shadow-md";
    if (isCurrent) return "border-brand-400 bg-white shadow-sm";
    if (isPast) return "border-slate-200 bg-slate-50";
    return "border-slate-200 bg-white";
  })();

  const headerTone = (() => {
    if (isCurrent) return "bg-brand-50/70";
    if (isPast) return "bg-slate-100";
    return "bg-slate-50/50";
  })();

  return (
    <div
      onClick={onSelect}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer group
        ${cardTone} hover:border-brand-300 hover:shadow-sm
      `}
    >
      {isCurrent && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-500/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
          現在
        </span>
      )}
      {isPast && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600">
          過去
        </span>
      )}
      <div
        className={`p-4 ${headerTone} border-b border-slate-100 flex justify-between items-center`}
      >
        <div>
          <h3 className="text-lg font-bold text-slate-800">{bucket.label}</h3>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            {bucket.startAge}-{bucket.endAge}歳
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-700">
            {completedCount}/{itemCount} 完了
          </span>
        </div>
      </div>

      <div className="h-1 w-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ${
            isPast ? "bg-slate-400" : "bg-brand-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`p-4 min-h-[120px] ${isPast ? "bg-slate-50" : ""}`}>
        {itemCount === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <AlertCircle size={20} className="opacity-20" />
            <span className="text-xs">バケットは空です</span>
          </div>
        ) : (
          <div className="space-y-3">
            {bucket.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                {item.status === ItemStatus.DONE ? (
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                ) : item.status === ItemStatus.IN_PROGRESS ? (
                  <Clock3 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-300 mt-0.5 shrink-0" />
                )}
                <span
                  className={`line-clamp-1 ${
                    item.status === ItemStatus.DONE ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  {item.title}
                </span>
              </div>
            ))}
            {itemCount > 3 && <p className="text-xs text-slate-400 pl-6">他 +{itemCount - 3} 件のアイテム</p>}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex gap-1">
        {categories.map((cat) => {
          const Config = CATEGORY_CONFIG[cat as Category];
          if (!Config) return null;
          return (
            <div key={cat} className={`p-1 rounded-md ${Config.bg} text-slate-600`} title={Config.label}>
              <Config.icon size={12} className={Config.color} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BucketCard;
