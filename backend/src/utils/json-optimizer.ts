const keyMap = {
  id: 'i',
  name: 'n',
  children: 'c',
  rightBranch: 'r',
};

const reverseKeyMap = {
  i: 'id',
  n: 'name',
  c: 'children',
  r: 'rightBranch',
};

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
