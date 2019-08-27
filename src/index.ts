import csv from 'fast-csv';

export type RowValidateCallback = (
  error?: Error | null,
  isValid?: boolean,
  reason?: string
) => void;

import schema from './validation-schema';

interface IProgramme {
  show: string;
  date: string;
  startTime: string;
  endTime: string;
  genre: string;
  description: string;
  type: string;
  synopsis: string;
  frequency: string;
  season: string;
  numberOfEpisodes: string;
  channel: string;
  channelCode: string;
}

interface IChannel {
  id: string;
  code: string;
  name: string;
}

export default (csvData: NodeJS.ReadableStream, channels: IChannel[]): Promise<IProgramme[]> =>
  new Promise<IProgramme[]>((resolve, reject) => {
    const options = { trim: true, headers: true };
    const validRows = [];
    const invalidRows = [];

    const onValidateRow = (row: IProgramme, next: RowValidateCallback) => {
      let isRowValid = true;

      schema.validate(row, error => {
        if (error) {
          isRowValid = !isRowValid;
        }

        next(null, isRowValid);
      });
    };

    const onInvalidRow = (invalidRow: IProgramme, rowNumber: number) => {
      invalidRows.push({
        rowNumber,
        data: invalidRow,
      });
    };

    const onData = (validRow: IProgramme) => {
      validRows.push(validRow);
    };

    const onEnd = () => {
      const errors = invalidRows.map(row => ({ row: row.rowNumber, data: row.data }));

      if (errors.length) {
        return reject(errors);
      }

      return resolve(validRows);
    };

    const onTransform = (row: IProgramme) => {
      const channel = channels.find(({ code }) => code === row.channelCode);

      row.channel = channel.id;

      const { channelCode, ...rest } = row;

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
