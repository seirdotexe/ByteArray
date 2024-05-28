import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ByteArray, { Enums } from '../index.js';

describe('compression test', () => {
  it('should support zlib', async () => {
    const bytearr = new ByteArray();
    const str = 'I will be compressed using zlib.';

    bytearr.writeUTFBytes(str);

    await bytearr.compress();
    await bytearr.decompress();

    const out = bytearr.readUTFBytes(bytearr.bytesAvailable);

    assert.equal(out, str);
  });

  it('should support deflate', async () => {
    const bytearr = new ByteArray();
    const str = 'I will be compressed using deflate.';

    bytearr.writeUTFBytes(str);

    await bytearr.compress(Enums.CompressionAlgorithm.DEFLATE);
    await bytearr.decompress(Enums.CompressionAlgorithm.DEFLATE);

    const out = bytearr.readUTFBytes(bytearr.bytesAvailable);

    assert.equal(out, str);
  });

  it('should support gzip', async () => {
    const bytearr = new ByteArray();
    const str = 'I will be compressed using gzip.';

    bytearr.writeUTFBytes(str);

    await bytearr.compress(Enums.CompressionAlgorithm.GZIP);
    await bytearr.decompress(Enums.CompressionAlgorithm.GZIP);

    const out = bytearr.readUTFBytes(bytearr.bytesAvailable);

    assert.equal(out, str);
  });

  it('should support brotli', async () => {
    const bytearr = new ByteArray();
    const str = 'I will be compressed using brotli.';

    bytearr.writeUTFBytes(str);

    await bytearr.compress(Enums.CompressionAlgorithm.BROTLI);
    await bytearr.decompress(Enums.CompressionAlgorithm.BROTLI);

    const out = bytearr.readUTFBytes(bytearr.bytesAvailable);

    assert.equal(out, str);
  });
});