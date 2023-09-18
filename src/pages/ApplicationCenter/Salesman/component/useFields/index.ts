import { connect } from '@formily/antd';

import { DownloadTemplate } from './DownloadTemplate';
import { RecruitPoster } from './RecruitPoster';

import { SettingAreaTips } from './SettingAreaTips';

import { AchievementBox } from '../../Detail/component/AchievementBox';
import { DetailEditor } from '../../../../Product/Manager/Form/components/FormFields/DetailEditor';

export const useFields = () => ({
  detailEditor: connect()(DetailEditor),
  downloadTemplate: connect()(DownloadTemplate),
  recruitPoster: connect()(RecruitPoster),
  achievementBox: connect()(AchievementBox),
  settingAreaTips: connect()(SettingAreaTips),
});
