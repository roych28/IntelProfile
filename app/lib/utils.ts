import { Profile, MergedData } from '@/types';

export const mergeDataBySource = (data: Profile[]): MergedData => {
  const mergedData: MergedData = {};
  data.forEach(item => {
    const source = item.source;
    if (!mergedData[source]) {
      mergedData[source] = { ...item, count: 1 };
    } else {
      mergedData[source].count += 1;
    }
  });
  return mergedData;
};
