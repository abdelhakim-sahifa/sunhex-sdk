/**
 * SunHex Quantum Protocol - Serialization Layer
 */

import { COUNTRY_CODES } from "./constants";

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    countryCode: string; // ISO 2-letter
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    gender: "Male" | "Female" | "Other";
}

const EPOCH = new Date("1900-01-01T00:00:00Z").getTime();
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function pack(info: PersonalInfo): Uint8Array {
    const encoder = new TextEncoder();
    const fullName = `${info.firstName} ${info.lastName}`;
    const nameBytes = encoder.encode(fullName);

    const birthDate = new Date(`${info.birthYear}-${String(info.birthMonth).padStart(2, '0')}-${String(info.birthDay).padStart(2, '0')}T00:00:00Z`).getTime();
    const daysSinceEpoch = Math.floor((birthDate - EPOCH) / MS_PER_DAY);

    const countryIndex = Object.keys(COUNTRY_CODES).indexOf(info.countryCode.toUpperCase());
    const finalCountryIndex = countryIndex === -1 ? 0 : countryIndex;

    const buffer = new Uint8Array(1 + 1 + 2 + 2 + 1 + nameBytes.length);
    const view = new DataView(buffer.buffer);

    let offset = 0;
    view.setUint8(offset++, 1); // Version 1

    const genderMap = { "Male": 1, "Female": 2, "Other": 3 };
    view.setUint8(offset++, genderMap[info.gender] || 0);

    view.setUint16(offset, finalCountryIndex, false); offset += 2;
    view.setUint16(offset, daysSinceEpoch, false); offset += 2;

    view.setUint8(offset++, nameBytes.length);
    buffer.set(nameBytes, offset);

    return buffer;
}

export function unpack(buffer: Uint8Array): PersonalInfo {
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const decoder = new TextDecoder();

    let offset = 0;
    const version = view.getUint8(offset++);
    if (version !== 1) throw new Error(`Unsupported protocol version: ${version}`);

    const genderVal = view.getUint8(offset++);
    const genderRevMap: Record<number, PersonalInfo["gender"]> = { 1: "Male", 2: "Female", 3: "Other" };
    const gender = genderRevMap[genderVal] || "Other";

    const countryIndex = view.getUint16(offset, false); offset += 2;
    const daysSinceEpoch = view.getUint16(offset, false); offset += 2;

    const nameLen = view.getUint8(offset++);
    const nameBytes = buffer.slice(offset, offset + nameLen);
    const fullName = decoder.decode(nameBytes);
    const [firstName = "", ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const countryCode = Object.keys(COUNTRY_CODES)[countryIndex] || "??";

    const birthDate = new Date(EPOCH + (daysSinceEpoch * MS_PER_DAY));

    return {
        firstName,
        lastName,
        countryCode,
        birthYear: birthDate.getUTCFullYear(),
        birthMonth: birthDate.getUTCMonth() + 1,
        birthDay: birthDate.getUTCDate(),
        gender
    };
}
