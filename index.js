'use strict';

const pkg = require('./package.json');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2), { string: 'o' });
const usage =
`${pkg.name} ${pkg.version}
Usage: ${pkg.name} <env_var> [<env_var2> ...] [-o <file.json>]

Options:
  -o <file.json>  Export the JSON to specified file instead of stdout
`;

if (!args._.length) {
  console.error(usage);
  process.exit(1);
}

let env = JSON.stringify(args._.reduce((env, v) => {
  env[v] = process.env[v];
  return env;
}, {}));

if (args.o) {
  fs.writeFileSync(args.o, env);
} else {
  console.log(env);
}
