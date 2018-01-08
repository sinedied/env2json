'use strict';

const pkg = require('./package.json');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2), { string: ['o', 'f'] });
const usage =
`${pkg.name} ${pkg.version}
Usage: ${pkg.name} <env_var> [<env_var2> ...] [-o <file>] [-f json|js]

Options:
  -o <file>      Export to specified file instead of stdout
  -f json|js     Output format, can be JSON or JavaScript
`;

if (!args._.length) {
  console.error(usage);
  process.exit(1);
}

let env = JSON.stringify(args._.reduce((env, v) => {
  env[v] = process.env[v];
  return env;
}, {}), null, 2);

if (args.f === 'js') {
  // Change to single quotes
  env = env.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, v) => {
    const s = v
      .replace(/'/g, '\\\'')
      .replace(/\\"/g, '"');
      return `'${s}'`;
  });
  env = `export default ${env};\n`;
}

if (args.o) {
  fs.writeFileSync(args.o, env);
} else {
  console.log(env);
}
