import csv = require('fast-csv');

import schema = require('./validation-schema');

module.exports = (csvData, channels) => 
  new Promise((resolve, reject) => {
    const options = { trim: true, headers: true };
    const validRows = [];
    const invalidRows = [];

    const onValidateRow = (row, next) => {
      let isRowValid = true;

      schema.validate(row, error => {
        if (error) {
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
        return reject(errors);
      }

      return resolve(validRows);
    };

    const onTransform = row => {
      const channel = channels.find(({ code }) =>  code === row.channelCode);

      row.channel = channel.id;

      const { channelCode, ...rest } = row;
      console.log(rest);
      return rest;
    };

    csv
      .parseStream(csvData, options)
      .transform(onTransform)
      .validate(onValidateRow)
      .on('data-invalid', onInvalidRow)
      .on('data', onData)
      .on('end', onEnd);
});