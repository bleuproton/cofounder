const fs = require('fs');
const path = require('path');

const appsRoot = path.resolve(__dirname, '..', 'apps');

function isAppDir(entry) {
  return entry.isDirectory() && !entry.name.startsWith('.') && entry.name.toLowerCase() !== 'node_modules';
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function buildTasks(appName) {
  return {
    version: '2.0.0',
    tasks: [
      {
        label: `npm install (${appName})`,
        type: 'shell',
        command: 'npm install',
        options: {
          cwd: '${workspaceFolder}'
        },
        problemMatcher: []
      },
      {
        label: `npm run dev (${appName})`,
        type: 'shell',
        command: 'npm run dev',
        options: {
          cwd: '${workspaceFolder}'
        },
        problemMatcher: [],
        isBackground: true,
        presentation: {
          reveal: 'always'
        }
      }
    ]
  };
}

function buildSettings(appName) {
  return {
    'terminal.integrated.cwd': '${workspaceFolder}',
    'files.exclude': {
      '**/.turbo': true,
      '**/node_modules': true
    },
    'cofounder.theia.appName': appName
  };
}

function main() {
  if (!fs.existsSync(appsRoot)) {
    console.log(`apps directory not found at: ${appsRoot}`);
    return;
  }

  const entries = fs.readdirSync(appsRoot, { withFileTypes: true }).filter(isAppDir);

  if (!entries.length) {
    console.log('No app directories found under ./apps. Nothing to do.');
    return;
  }

  entries.forEach((entry) => {
    const appName = entry.name;
    const appPath = path.join(appsRoot, appName);
    const theiaDir = path.join(appPath, '.theia');

    writeJson(path.join(theiaDir, 'tasks.json'), buildTasks(appName));
    writeJson(path.join(theiaDir, 'settings.json'), buildSettings(appName));

    console.log(`Generated Theia tasks for ${appName} -> ${path.relative(process.cwd(), theiaDir)}`);
  });
}

main();
