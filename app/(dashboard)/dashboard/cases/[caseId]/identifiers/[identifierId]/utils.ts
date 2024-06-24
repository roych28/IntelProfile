export const mergeDataBySource = (data) => {
    const mergedData = {};
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
  