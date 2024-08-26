import { TPosition } from "@/types/positions";

type CategorizedPositions = {
  livePositions: Partial<TPosition>[];
  notStartedOrExpiredPositions: Partial<TPosition>[];
};

export const sortAndCategorizePositions = (
  positions: Partial<TPosition>[]
): CategorizedPositions => {
  const now = new Date().getTime();
  const livePositions: Partial<TPosition>[] = [];
  const notStartedOrExpiredPositions: Partial<TPosition>[] = [];

  positions.forEach((position) => {
    if (!position.endTime || !position.startTime) return; // Skip if required properties are missing

    const end = new Date(position.endTime).getTime();
    const start = new Date(position.startTime).getTime();

    if (now >= start && now <= end) {
      livePositions.push(position);
    } else {
      notStartedOrExpiredPositions.push(position);
    }
  });

  return {
    livePositions: livePositions.sort(
      (a, b) =>
        new Date(a?.startTime as string).getTime() -
        new Date(b?.startTime as string).getTime()
    ),
    notStartedOrExpiredPositions: notStartedOrExpiredPositions.sort(
      (a, b) =>
        new Date(a?.startTime as string).getTime() -
        new Date(b?.startTime as string).getTime()
    ),
  };
};
