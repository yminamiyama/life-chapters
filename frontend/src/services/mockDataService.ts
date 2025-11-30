import { BucketItem, Category, Difficulty, ItemStatus, RiskLevel, TimeBucket } from "@/types";

const currentYear = new Date().getFullYear();
const birthYear = 1995;
const currentAge = currentYear - birthYear;

const generateBuckets = (): TimeBucket[] => {
  const buckets: TimeBucket[] = [];
  const startAge = 20;
  const maxAge = 80;
  const step = 5;

  for (let age = startAge; age < maxAge; age += step) {
    let description = "";
    if (age < 30) description = "基盤構築と探索の時期";
    else if (age < 50) description = "積み上げと成長の時期";
    else description = "熟成と享受の時期";

    buckets.push({
      id: `bucket-${age}`,
      label: `${age}-${age + step - 1}`,
      startAge: age,
      endAge: age + step - 1,
      description,
      items: [],
    });
  }
  return buckets;
};

const initialItems: BucketItem[] = [
  {
    id: "item-1",
    timeBucketId: "bucket-25",
    title: "東南アジアのバックパッカー旅行",
    description: "タイ、ベトナム、カンボジアを2ヶ月かけて巡る。",
    category: Category.LEISURE,
    difficulty: Difficulty.MEDIUM,
    riskLevel: RiskLevel.LOW,
    costEstimate: 500,
    status: ItemStatus.DONE,
    targetYear: birthYear + 26,
    valueStatement: "体力が十分にあるうちに異文化を体験し、視野を広げる。",
  },
  {
    id: "item-2",
    timeBucketId: "bucket-30",
    title: "最初の投資用不動産を購入",
    description: "賃貸収入確保のために区分マンションを購入する。",
    category: Category.FINANCE,
    difficulty: Difficulty.HIGH,
    riskLevel: RiskLevel.MEDIUM,
    costEstimate: 5000,
    status: ItemStatus.IN_PROGRESS,
    targetYear: birthYear + 32,
    valueStatement: "長期的な経済的自由の基盤を作る。",
  },
  {
    id: "item-3",
    timeBucketId: "bucket-30",
    title: "フルマラソン完走",
    description: "サブ4（4時間切り）を目指して完走する。",
    category: Category.HEALTH,
    difficulty: Difficulty.HIGH,
    riskLevel: RiskLevel.MEDIUM,
    costEstimate: 50,
    status: ItemStatus.PLANNED,
    targetYear: birthYear + 31,
    valueStatement: "関節への負担が大きくなる前に肉体の限界に挑戦する。",
  },
  {
    id: "item-4",
    timeBucketId: "bucket-40",
    title: "家族でディズニーワールドへ",
    description:
      "子供たちが記憶に残る年齢で、かつ純粋に楽しめる時期（魔法を信じている時期）に行く。",
    category: Category.RELATIONSHIPS,
    difficulty: Difficulty.MEDIUM,
    riskLevel: RiskLevel.LOW,
    costEstimate: 1000,
    status: ItemStatus.PLANNED,
    targetYear: birthYear + 42,
    valueStatement: "家族のかけがえのない思い出（メモリー配当）を作る。",
  },
  {
    id: "item-5",
    timeBucketId: "bucket-50",
    title: "小型飛行機の操縦免許取得",
    description: "PPLライセンスを取得し、自分で操縦して空を飛ぶ。",
    category: Category.LEARNING,
    difficulty: Difficulty.HIGH,
    riskLevel: RiskLevel.HIGH,
    costEstimate: 2000,
    status: ItemStatus.PLANNED,
    targetYear: birthYear + 52,
    valueStatement: "子供の頃からの夢を叶える。",
  },
];

export const getInitialData = () => {
  const buckets = generateBuckets();

  initialItems.forEach((item) => {
    const bucket = buckets.find((b) => b.id === item.timeBucketId);
    if (bucket) {
      bucket.items.push(item);
    }
  });

  return {
    user: {
      id: "u1",
      name: "デモユーザー",
      birthYear,
      currentAge,
    },
    buckets,
  };
};
