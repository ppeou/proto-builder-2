const internalPaths = {
  protoc: './compiler/protoc.exe',
  staging: './stagging',
  output: './output',
};

const cliArgMap = {
  '-i': 'input',
  '-o': 'output',
  '-v': 'verbose',
  '-s': 'silent'
};

module.exports = {
  internalPaths,
  cliArgMap
};