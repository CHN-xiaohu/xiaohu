export const loopModelCategories = (dataSource: any) => {
  dataSource.forEach((item: any) => {
    if (item.children) {
      loopModelCategories(item.children);
    }
    if (item.name !== undefined) {
      item.label = item.name;
      item.value = item.id;
    }
  });

  return dataSource;
};
