import {
  getSquaredEuclideanDistance,
  isValidPosition,
} from '#utils/distance.utils'

describe('Distance utils', () => {
  describe('getManhattanDistance', () => {
    test.each([
      [
        {
          origin: {
            x: 0,
            y: 0,
          },
          destination: {
            x: 0,
            y: 0,
          },
          expected: 0,
        },
      ],
      [
        {
          origin: {
            x: 0,
            y: 0,
          },
          destination: {
            x: 2,
            y: 3,
          },
          expected: 13,
        },
      ],
      [
        {
          origin: {
            x: 1,
            y: 1,
          },
          destination: {
            x: 2,
            y: 3,
          },
          expected: 5,
        },
      ],
      [
        {
          origin: {
            x: -1,
            y: -3,
          },
          destination: {
            x: 2,
            y: 3,
          },
          expected: 45,
        },
      ],
      [
        {
          origin: {
            x: 2,
            y: 3,
          },
          destination: {
            x: -1,
            y: -3,
          },
          expected: 45,
        },
      ],
      [
        {
          origin: {
            x: -2,
            y: -5,
          },
          destination: {
            x: -1,
            y: -3,
          },
          expected: 5,
        },
      ],
      [
        {
          origin: {
            x: 47.6,
            y: -122.4,
          },
          destination: {
            x: 47.581,
            y: -122.316,
          },
          expected: 0.0074,
        },
      ],
      [
        {
          origin: {
            x: '0',
            y: 0,
          },
          destination: {
            x: 2,
            y: '3',
          },
          expected: 13,
        },
      ],
    ])(
      'should compute the correct Squared Euclidean distance from $origin to $destination',
      ({ origin, destination, expected }) => {
        expect(getSquaredEuclideanDistance(origin, destination)).toBeCloseTo(
          expected,
          4
        )
      }
    )

    it('should throw error if position coordinates are not valid', () => {
      expect(() =>
        getSquaredEuclideanDistance(
          {
            x: 'invalid',
            y: 0,
          },
          { x: 1, y: 2 }
        )
      ).toThrow('invalid position')
    })
  })

  describe('isValidPosition', () => {
    it.each([
      [
        {
          position: {
            x: 43.12,
            y: -112.3,
          },
          expected: true,
        },
      ],
      [
        {
          position: {
            x: '',
            y: -112.3,
          },
          expected: true,
        },
      ],
      [
        {
          position: {
            x: 'abc',
            y: -112.3,
          },
          expected: false,
        },
      ],
    ])('should validate the position', ({ position, expected }) => {
      expect(isValidPosition(position)).toBe(expected)
    })
  })
})
