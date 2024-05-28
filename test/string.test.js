import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ByteArray from '../index.js';

describe('string test', () => {
  it('should support utf8 strings', () => {
    const bytearr = new ByteArray();

    bytearr.writeUTF('This is a test.');
    bytearr.writeUTFBytes('ABC123');

    bytearr.position = 0;

    assert.equal(bytearr.readUTF(), 'This is a test.');
    assert.equal(bytearr.readUTFBytes(6), 'ABC123');
  });

  it('should support different charsets', () => {
    const bytearr = new ByteArray();

    bytearr.writeMultiByte('Тест', 'win1251');
    bytearr.writeMultiByte('テスト', 'cp932');

    bytearr.position = 0;

    assert.equal(bytearr.readMultiByte(4, 'win1251'), 'Тест');
    assert.equal(bytearr.readMultiByte(6, 'cp932'), 'テスト');
  });
});