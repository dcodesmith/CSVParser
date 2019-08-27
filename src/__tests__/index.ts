import * as fs from 'fs';
import * as stream from 'stream';

import CSVParser from '..';

import { channels } from './fixtures.json';

const getCSVBuffer = (fileName: string): NodeJS.ReadableStream => {
  const bufferStream = new stream.PassThrough();
  const filePath = `${__dirname}/${fileName}.csv`;

  try {
    const buffer = fs.readFileSync(filePath);
    bufferStream.end(buffer);
  } catch (error) {
    throw error;
  }

  return bufferStream;
};

const MOCK_CHANNELS = [...channels];

test('valid', async () => {
  const CSVBuffer = getCSVBuffer('valid');

  const data = await CSVParser(CSVBuffer, MOCK_CHANNELS);

  expect(data).toMatchSnapshot();
});

test('invalid', async () => {
  const CSVBuffer = getCSVBuffer('invalid');

  try {
    await CSVParser(CSVBuffer, MOCK_CHANNELS);
  } catch (error) {
    expect(error).toBeDefined();
  }
});
