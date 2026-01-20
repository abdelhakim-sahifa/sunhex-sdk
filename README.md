
![sunhex](https://i.ibb.co/q32LXH2C/sunhex.png "sunhex")

# @sunhex/protocol SDK

The official SunHex Quantum Protocol SDK for decentralized, stateless identity resolution.

## Installation

```bash
npm install @sunhex/protocol
```

## Quick Start

### 1. Local Resolution (Edge-native)
Resolution happens entirely on your machine. No data ever touches the SunHex servers.

```javascript
import { SunHex } from '@sunhex/protocol';

const sunhex = new SunHex();

// Resolve a Quantum Fragment
const identity = await sunhex.resolveLocal(
  "01A7F2D...", // The Fragment
  "1234"        // User Private PIN
);

console.log(identity.firstName); // "Abdelhakim"
```

### 2. Crystallization (Fragment Generation)
Securely pack and encrypt biological data into a stateless code.

```javascript
const fragment = await sunhex.crystallizeLocal({
  firstName: "Jane",
  lastName: "Doe",
  countryCode: "US",
  birthYear: 1995,
  birthMonth: 5,
  birthDay: 12,
  gender: "Female"
}, "pin_secret_99");

console.log(fragment); // "02F9A12..."
```

## Security Mandate
This SDK uses the **Web Crypto API** to ensure hardware-accelerated, secure operations:
- **Encryption**: AES-256-GCM (Authenticated Encryption)
- **Key Derivation**: PBKDF2-SHA256 (100,000 Iterations)
- **Serialization**: Compact bit-packing binary protocol.

## Vision
SunHex aims to eliminate "Identity Honeypots" by giving users total sovereignty over their biological data. We don't store—we compute.

---
Developed by [Abdelhakim Sahifa](https://github.com/abdelhakim-sahifa).

Repository [SunHex-sdk](https://github.com/abdelhakim-sahifa/sunhex-sdk).

Documentation [Documentation](https://sunhex.vercel.app/docs).


