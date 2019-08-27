const stream = require('stream');
const fs = require('fs');

const CSVParser = require('..');

const { channels } = require('./fixtures.json');

const getCSVBuffer = fileName => {
  const bufferStream = new stream.PassThrough();
  const filePath = `${__dirname}/${fileName}.csv`;

  try {
    const buffer = fs.readFileSync(filePath);
    bufferStream.end(buffer);
  } catch (error) {
    console.error(error);
  }

  return bufferStream;
}

const MOCK_CHANNELS = [ ...channels ];

test('valid', async () => {
  const CSVBuffer = getCSVBuffer('valid');

  const data = await CSVParser(CSVBuffer, MOCK_CHANNELS);

  expect(data).toBeDefined();
});

test('invalid', async () => {
  const CSVBuffer = getCSVBuffer('invalid');

  try {
    await CSVParser(CSVBuffer, MOCK_CHANNELS);
  } catch (error) {
    expect(error).toBeDefined();
  }
});
