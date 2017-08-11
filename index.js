import fs from 'fs';
import { each } from 'lodash';
import rename from './lib/rename';
import editFileOfType from './lib/file_editor';

const originalPath = 'files/original/';
const savedPath = 'files/moved/';
const errors = [];
let successCount = 0;

function renameAndEditSingleFile(filename, callback) {
  const [name, extension] = filename.split('.');
  const fullyQualifiedPath = originalPath + filename;
  const newName = rename(name, extension);

  fs.readFile(fullyQualifiedPath, 'utf-8', (readError, data) => {
    if (readError) callback(readError, filename);
    else {
      editFileOfType(data, extension, filename, newName, (editError, newData) => {
        if (editError) callback(editError, filename);
        else {
          fs.writeFile(savedPath + newName, newData, 'utf-8', (writeError) => {
            callback(writeError, filename);
          });
        }
      });
    }
  });
}

function renameAndEditFiles(callback) {
  fs.readdir(originalPath, (error, files) => {
    if (error) throw error;
    each(files, (file) => {
      renameAndEditSingleFile(file, (renameError, filename) => {
        if (renameError) errors.push(filename);
        else successCount += 1;

        // I don't love this pattern - I want an async loop that calls
        // the callback when all are finished and collects errors.
        // async's each / map / etc call the callback _as soon as there's an error_
        if ((successCount + errors.length) === files.length) {
          callback(errors, successCount);
        }
      });
    });
  });
}

// create the output dir if needed
if (!fs.existsSync(savedPath)) {
  fs.mkdirSync(savedPath);
}

/* eslint-disable no-console */
renameAndEditFiles((erroredFiles, renamedFilesCount) => {
  const errorCount = erroredFiles.length;
  console.log(`renamed ${renamedFilesCount} files with ${errorCount} errors`);
  if (errorCount > 0) console.log(`(${erroredFiles})`);
  // at this point we should probably delete the old files that were moved,
  // but that would make this program difficult to utilize in this context
});
/* eslint-enable no-console */

export { originalPath, savedPath };
