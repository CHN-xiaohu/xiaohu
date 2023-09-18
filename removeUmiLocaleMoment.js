const path = require('path');

const chalk = require('chalk');
const fs = require('fs-extra');

const pluginLocalePath = path.join(__dirname, 'node_modules/@umijs/plugin-locale/lib/index.js');
const bakPluginLocalePath = `${pluginLocalePath}.bak`;

// 因为 umi 为了兼容 antd， 默认载入 moment.js, 而项目本身已经是没有使用 moment.js
const main = async () => {
  let fileContent = (await fs.readFile(pluginLocalePath)).toString();

  if (!fs.existsSync(bakPluginLocalePath)) {
    fs.copyFile(pluginLocalePath, bakPluginLocalePath);
  }

  fileContent = fileContent.replace(
    /localeTpl, {(\s+)MomentLocales,(\s+)DefaultMomentLocale,/g,
    `localeTpl, {
        MomentLocales: [],
        DefaultMomentLocale,`,
  );

  await fs.writeFile(pluginLocalePath, fileContent);

  console.log(chalk.green(`✔ 临时修改 umi-plugin-locale 源码，以完整去除 moment`));
};

main();
