interface DataItem {
  source: string;
  [key: string]: any; // Use this if there are other unknown properties
}

interface MergedDataItem extends DataItem {
  count: number;
}

export const mergeDataBySource = (data: DataItem[]): Record<string, MergedDataItem> => {
  const mergedData: Record<string, MergedDataItem> = {};

  data.forEach((item) => {
    const source = item.source;
    if (!mergedData[source]) {
      mergedData[source] = { ...item, count: 1 };
    } else {
      mergedData[source].count += 1;
    }
  });

  return mergedData;
};
