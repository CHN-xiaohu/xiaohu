import type { IFormActions, IFormAsyncActions } from '@formily/antd';

/**
 * 用于弹窗表单动态切换当前显示的表单项
 *
 * @param {IFormActions, IFormAsyncActions} formActions 表单握手的 actions
 * @param {string[]} layoutItems 当前所有需要切换的表单布局项集合
 * @param {string} currentLayoutItem 当前显示的表单布局项
 */
export const changeVisibleFormLayoutItemForLayerForm = (
  formActions: IFormActions | IFormAsyncActions,
  layoutItems: string[],
  currentLayoutItem: string,
) => {
  // 动态检测当前 schema 是否在允许展示的列表中
  // 需要延迟执行，因为第一次打开弹窗的时候，表单还没初始化，这会导致 formActions 没有握手成功就执行了
  return new Promise((resolve) => {
    setTimeout(() => {
      for (let i = 0; i < layoutItems.length; i += 1) {
        const item = layoutItems[i];

        formActions.setFieldState(layoutItems[i], (fieldState) => {
          fieldState.visible = item === currentLayoutItem;
        });
      }

      resolve(undefined);
    });
  });
};
