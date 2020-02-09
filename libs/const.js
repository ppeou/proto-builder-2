const internalPaths = {
  protoc: './compiler/protoc.exe',
  staging: './stagging',
  output: './output',
};

const cliArgMap = {
  '-i': 'input',
  '-o': 'output',
  '-v': 'verbose',
  '-q': 'quiet'
};

module.exports = {
  internalPaths,
  cliArgMap
};