import { originalPath, savedPath } from '../index';

function appendNewLinesForTxt(filedata, originalName, newName, callback) {
  let data = filedata;
  data += `\n${originalName}`;
  data += `\n${originalPath}${originalName}`;
  data += `\n${newName}`;
  data += `\n${savedPath}${newName}`;
  callback(null, data);
}

function writeNewPropsForJson(filedata, originalName, newName, callback) {
  let json = {};
  try {
    json = JSON.parse(filedata);
  } catch (e) {
    callback(e);
    return;
  }

  json.originalName = originalName;
  json.originalPath = originalPath + originalName;
  json.newFileame = newName;
  json.newPath = savedPath + newName;

  callback(null, JSON.stringify(json));
}

export default function editFileOfType(filedata, extension, filename, newName, callback) {
  if (extension === 'txt') {
    appendNewLinesForTxt(filedata, filename, newName, (error, newData) => {
      callback(error, newData);
    });
  } else if (extension === 'json') {
    return writeNewPropsForJson(filedata, filename, newName, (error, newData) => {
      callback(error, newData);
    });
  }
  return filedata;
}
