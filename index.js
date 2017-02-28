const csv = require('fast-csv');
const find = require('lodash/fp/find');
const Joi = require('joi');

const schema = require('./validation-schema');

const validRows = [];
const invalidRows = [];

/*
|---------------------------------------------------------------
| Usage
|---------------------------------------------------------------
| As a Promise -> parseCSV(bufferStream, channels)
|                   .then((programmes) => {
|                     callback(null, programmes);
|                   }).catch(callback);
|
| As a callback -> parseCSV(bufferStream, channels, callbackFn);
|
*/

module.exports = function (csvData, channels, callbackFn) {
  const options = { trim: true, headers: true };

  const parser = (...args) => {
    const [ resolve, reject ] = args;

    const onValidateRow = (row, next) => {
      let isRowValid = true;

      schema.validate(row, (err) => {
        if (err) {
          isRowValid = !isRowValid;
        }

        next(null, isRowValid);
      });
    };

    const onInvalidRow = (invalidRow, rowNumber) => {
      invalidRows.push({
        rowNumber,
        data: invalidRow
      });
    };

    const onData = (validRow) => {
      validRows.push(validRow);
    };

    const onEnd = () => {
      const errors = invalidRows.map(row => ({ row: row.rowNumber, data: row.data }));

      if (errors.length) {

        if (callbackFn) {
          return callbackFn(errors, null);
        }

        return reject(errors);
      }

      if (callbackFn) {
        return callbackFn(null, validRows);
      }

      return resolve(validRows);
    };

    const onTransform = (row) => {
      const channel = find(channels, { code: row.channelCode });

      delete row.channelCode;

      row.channel = channel.id;

      return row;
    };

    csv
      .fromStream(csvData, options)
      .transform(onTransform)
      .validate(onValidateRow)
      .on('data-invalid', onInvalidRow)
      .on('data', onData)
      .on('end', onEnd);
  }

  if (callbackFn) {
    return parser();
  }

  return new Promise(parser);
}