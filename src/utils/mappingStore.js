let mappings = [];

function save(newMappings) {
  mappings = newMappings;
}

function get() {
  return mappings;
}

function isReady() {
  return mappings.length > 0;
}

module.exports = {
  save,
  get,
  isReady,
};