const { parseStartDate, parseEndDate } = require('../../../src/utils/date');

describe("Utils Date: ", function() {
  describe("parseStartDate, ", function() {
    it("should return error with receive the wrong date", () => {
      expect(() => parseStartDate('2023212-03248')).toThrow(new Error('The date format is invalid.'))
    });

    it("should return the date with the first day of the month and the first hour", () => {
      expect(parseStartDate('2022-08')).toEqual(new Date('2022-08-01T00:00:00.000Z'))
    });

    it("should return the date with the first hour", () => {
      expect(parseStartDate('2022-08-03')).toEqual(new Date('2022-08-03T00:00:00.000Z'))
    });
  });

  describe("parseEndDate, ", function() {
    it("should return error with receive the wrong date", () => {
      expect(() => parseEndDate('2023212-03248')).toThrow(new Error('The date format is invalid.'))
    });

    it("should return the date with the last day of the month and the last hour", () => {
      expect(parseEndDate('2022-08')).toEqual(new Date('2022-08-31T23:59:59.000Z'))
    })

    it("should return the date with the last hour", () => {
      expect(parseEndDate('2022-08-03')).toEqual(new Date('2022-08-03T23:59:59.000Z'))
    })
  });
});
