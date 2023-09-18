const path = require('path');

const fs = require('fs-extra');
const chalk = require('chalk');

const resolveFileByNodeModules = (...args) => path.join(__dirname, 'node_modules', ...args);

const TreeSelectPath = resolveFileByNodeModules('rc-tree-select', 'es', 'TreeSelect.js');
const OptionListPath = resolveFileByNodeModules('rc-tree-select', 'es', 'OptionList.js');
const GeneratePath = resolveFileByNodeModules('rc-select', 'es', 'generate.js');

const readFileContent = async (filePath) => (await fs.readFile(filePath)).toString();

const writeTreeSelectJs = async () => {
  const content = await readFileContent(TreeSelectPath);

  return fs.writeFile(
    TreeSelectPath,
    content.replace(
      /{[\s].*focus: selectRef\.current\.focus,[\s].*blur:\sselectRef\.current\.blur$/gm,
      `{
      scrollTo: selectRef.current.scrollTo,
      focus: selectRef.current.focus,
      blur: selectRef.current.blur`,
    ),
  );
};

const writeOptionListJs = async () => {
  const content = await readFileContent(OptionListPath);

  return fs.writeFile(
    OptionListPath,
    content.replace(
      /{[\s].*onKeyDown: function onKeyDown\(event\) \{[\s].*[_treeRef$current2;]$/gm,
      `{
      scrollTo: treeRef.current?.scrollTo,
      onKeyDown: function onKeyDown(event) {
        var _treeRef$current2;`,
    ),
  );
};

const writeGenerateJs = async () => {
  const content = await readFileContent(GeneratePath);

  return fs.writeFile(
    GeneratePath,
    content.replace(
      /{[\s].*focus: selectorRef\.current\.focus,[\s].*blur: selectorRef\.current\.blur$/gm,
      `{
        scrollTo: listRef.current?.scrollTo,
        focus: selectorRef.current.focus,
        blur: selectorRef.current.blur`,
    ),
  );
};

(async () => {
  await writeTreeSelectJs();
  await writeOptionListJs();
  await writeGenerateJs();

  // @see https://github.com/react-component/tree-select/pull/298
  console.log(chalk.green(`✔ 临时修改 antd 源码，以便支持 tree select ref 能力`));
})();
