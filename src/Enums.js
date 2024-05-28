/**
 * @typedef {Object} CompressionAlgorithm
 * @property {string} ZLIB
 * @property {string} DEFLATE
 * @property {string} GZIP
 * @property {string} BROTLI
 *
 * @typedef {Object} Endian
 * @property {string} LITTLE_ENDIAN
 * @property {string} BIG_ENDIAN
 *
 * @typedef {Object} Enums - Available enums in ByteArray
 * @property {CompressionAlgorithm} CompressionAlgorithm - Available compression algorithms
 * @property {Endian} Endian - Available endianness
 *
 * @module ByteArray/Enums
 */
export default {
  CompressionAlgorithm: ({ ZLIB: 'zlib', DEFLATE: 'deflate', GZIP: 'gzip', BROTLI: 'brotli' }),
  Endian: ({ LITTLE_ENDIAN: 'LE', BIG_ENDIAN: 'BE' })
}