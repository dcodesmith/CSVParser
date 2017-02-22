const expect = require('chai').expect;
const stream = require('stream');
const _ = require('lodash');
const fs = require('fs');

const { channels, programmes } = require('./fixtures');

const getCSVBuffer = (fileName) => {
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

describe('Given a CSV Parser', () => {
  const csvParse = require('../index');

  describe('and there is a valid CSV Buffer', () => {
    const CSVBuffer = getCSVBuffer('valid');

    describe('and there are valid channels', () => {
      const MOCK_CHANNELS = _.merge({}, channels);

      describe('when the callback CVS Parser is invoked', () => {
        it('should parse the csv data', () => {
          csvParse(CSVBuffer, MOCK_CHANNELS, (err, data) => {
            expect(err).to.be.null;
            // TODO: test data
          });  
        }) 
      });

      describe('when the Promise CVS Parser is invoked', () => {
        it('should parse the csv data', () => {
          csvParse(CSVBuffer, MOCK_CHANNELS).then((data)=>{
            expect(data).to.exist;
            // TODO: test specific data              
          }).catch((err) => {
            expect(err).to.be.null;
          });
        }) 
      });
    });
  });

  describe('and there is an invalid CSV Buffer', () => {
    const CSVBuffer = getCSVBuffer('invalid');

    describe('and there are valid channels', () => {
      const MOCK_CHANNELS = _.merge({}, channels);

      describe('when the callback CVS Parser is invoked', () => {
        it('should parse the csv data', () => {
          csvParse(CSVBuffer, MOCK_CHANNELS, (err, data) => {
            expect(err).to.be.exist;
            // TODO: test data
          });  
        }) 
      });

      describe('when the Promise CVS Parser is invoked', () => {
        it('should parse the csv data', () => {
          csvParse(CSVBuffer, MOCK_CHANNELS)
            .catch((err) => {
              // TODO: test err
            });
        });
      });
    });
  });
});