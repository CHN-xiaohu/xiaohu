const path = require('path');
const fs = require('fs-extra');
const lodash = require('lodash');
const chalk = require('chalk');

const routesConfigPath = path.join(__dirname, 'routes');

// TODO: 格式的问题，其实可以交给 lint 去做的
const WRAP = '\r\n';
const spaceStr = `\x20`;
const getSpace = (length = 1) =>
  Array.from({ length })
    .map(() => spaceStr)
    .join('');

function writeImport(fileContent, routeNamesObj) {
  const toStrings = routeNamesObj
    .map(({ name, camelCase }) => `import ${camelCase} from './routes/${name}';`)
    .join(WRAP);

  return fileContent.replace(
    /(?<=\/\*\sauto-load-placeholder\s\*\/)([\s\S]*)(?=\/\*\sauto-load-placeholder\s\*\/)/,
    `${WRAP}${toStrings}${WRAP}`,
  );
}

function writeUse(fileContent, routeNamesObj) {
  const toStrings = routeNamesObj
    .map(({ camelCase }) => `${getSpace(10)}...${camelCase},`)
    .join('\r\n');
  const toTemplate = `${getSpace(8)}routes: [
${toStrings}
${getSpace(8)}],${WRAP}${getSpace(8)}`;

  return fileContent.replace(
    /(?<=\/\*\sauto-load-use-placeholder\s\*\/)([\s\S]*)(?=\/\*\sauto-load-use-placeholder\s\*\/)/,
    `${WRAP}${toTemplate}`,
  );
}

(async () => {
  const routeNames = await fs.readdir(routesConfigPath);
  const routeNamesObj = routeNames.sort().map((str) => {
    const name = str.replace('.ts', '');

    return {
      name,
      camelCase: lodash.camelCase(name),
    };
  });

  const routeIndexPath = path.join(__dirname, 'index.ts');
  const routeIndex = (await fs.readFile(routeIndexPath)).toString();

  let fileContent = writeImport(routeIndex, routeNamesObj);

  fileContent = writeUse(fileContent, routeNamesObj);

  if (routeIndex.replace(/\s|\r\n/g, '') !== fileContent.replace(/\s|\r\n/g, '')) {
    await fs.writeFile(routeIndexPath, fileContent);
  }

  console.log(chalk.green(`✔ 自动载入 routes 配置完成`));
})();
