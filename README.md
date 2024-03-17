# ByteArray

The [ActionScript ByteArray class](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/utils/ByteArray.html), written in modern JavaScript.

# Install

```
$ npm install @seirdotexe/bytearray
```

# Usage

Below you'll find an easy showcase of the library. You can also check out the [tests](https://github.com/seirdotexe/ByteArray/tree/main/test) for an extensive showcase on how to use the library.

```javascript
import ByteArray, { Enums } from '@seirdotexe/bytearray';

const bytearr = new ByteArray();

bytearr.endian = Enums.Endian.LITTLE_ENDIAN;

bytearr.writeByte(25);
bytearr.writeShort(1600);
bytearr.writeBoolean(false);
bytearr.writeUTF('Test_Message');

bytearr.position = 0;

bytearr.readByte(); // 25
bytearr.readShort(); // 1600
bytearr.readBoolean(); // false
bytearr.readUTF(); // Test_Message
```