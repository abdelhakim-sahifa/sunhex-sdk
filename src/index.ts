/**
 * SunHex Quantum Protocol SDK
 * Official library for decentralized identity resolution.
 */

import * as Crypto from "./crypto";
import * as Protocol from "./protocol";

export { Crypto, Protocol };
export type { PersonalInfo } from "./protocol";

export interface SunHexConfig {
    apiKey?: string;
    baseUrl?: string;
}

export class SunHex {
    private apiKey?: string;
    private baseUrl: string;

    constructor(config: SunHexConfig = {}) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || "https://protocol.sunhex.com";
    }

    /**
     * Resolve an identity fragment locally at the edge.
     * Total privacy. No API calls.
     */
    async resolveLocal(fragment: string, pin: string): Promise<Protocol.PersonalInfo> {
        const fullBuffer = Crypto.hexToUint8Array(fragment);

        // Extract components (Version 2 layout: [V:1][S:8][IV:12][Cipher:?])
        const version = fullBuffer[0];
        if (version !== 2) throw new Error(`Incompatible protocol version: ${version}`);

        const salt = fullBuffer.slice(1, 9);
        const iv = fullBuffer.slice(9, 21);
        const ciphertext = fullBuffer.slice(21);

        const key = await Crypto.deriveKey(pin, salt);
        const decrypted = await Crypto.decrypt(ciphertext, key, iv);

        return Protocol.unpack(decrypted);
    }

    /**
     * Crystallize an identity fragment locally.
     * Securely packs and encrypts biological data.
     */
    async crystallizeLocal(info: Protocol.PersonalInfo, pin: string): Promise<string> {
        const packed = Protocol.pack(info);
        const salt = crypto.getRandomValues(new Uint8Array(8));
        const key = await Crypto.deriveKey(pin, salt);
        const { ciphertext, iv } = await Crypto.encrypt(packed, key);

        const finalBuffer = new Uint8Array(1 + 8 + 12 + ciphertext.length);
        finalBuffer[0] = 2; // Version 2 (Quantum)
        finalBuffer.set(salt, 1);
        finalBuffer.set(iv, 9);
        finalBuffer.set(ciphertext, 21);

        return Crypto.uint8ArrayToHex(finalBuffer);
    }

    /**
     * Interact with the SunHex API Cluster (Optional).
     */
    async fetchMetadata(fragment: string) {
        if (!this.apiKey) throw new Error("API Key required for cluster calls.");

        const response = await fetch(`${this.baseUrl}/api/v1/metadata`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fragment })
        });

        return response.json();
    }
}

export const sunhex = new SunHex();
