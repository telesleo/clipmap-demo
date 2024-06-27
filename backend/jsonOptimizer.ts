// This code processes a JSON string to reduce its storage size
// by replacing specific values with more compact representations
// to optimize the JSON for efficient storage in a database.

// name to letter map
const keyMap = {
  id: 'i',
  name: 'n',
  children: 'c',
  rightBranch: 'r',
};

// letter to name map
const reverseKeyMap = {
  i: 'id',
  n: 'name',
  c: 'children',
  r: 'rightBranch',
};

// replaces all keys of the object from the name to the respective letter
function replacer(key, value) {
  if (value === '' || (Array.isArray(value) && value.length === 0)) {
    return undefined;
  }
  if (key === 'r') {
    return value ? 1 : 0;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const newValue = {};
    for (const k in value) {
      if (Object.hasOwnProperty.call(value, k)) {
        const newKey = keyMap[k] || k;
        newValue[newKey] = value[k];
      }
    }
    return newValue;
  }
  return value;
}

// replaces all keys of the object from the letter to respective the respective name
function reviver(key, value) {
  if (key === 'r') {
    return value === 1 ? true : false;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const newValue = {};
    for (const k in value) {
      if (Object.hasOwnProperty.call(value, k)) {
        const newKey = reverseKeyMap[k] || k;
        newValue[newKey] = value[k];
      }
    }
    return newValue;
  }
  return value;
}

export function serializeJsonString(jsonString: string) {
  return JSON.stringify(JSON.parse(jsonString), replacer);
}

export function deserializeJsonString(jsonString: string) {
  return JSON.stringify(JSON.parse(jsonString, reviver));
}