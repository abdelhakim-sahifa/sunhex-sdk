import { SunHex } from './index';

describe('SunHex Protocol', () => {
    const sunhex = new SunHex();
    const pin = '1234';
    const info = {
        firstName: 'Abdelhakim',
        lastName: 'Sahifa',
        countryCode: 'MA',
        birthYear: 2000,
        birthMonth: 1,
        birthDay: 1,
        gender: 'Male' as const
    };

    it('should crystallize and resolve identity locally', async () => {
        const fragment = await sunhex.crystallizeLocal(info, pin);
        expect(fragment).toBeDefined();
        expect(typeof fragment).toBe('string');

        const resolved = await sunhex.resolveLocal(fragment, pin);
        expect(resolved).toEqual(info);
    });

    it('should fail with wrong PIN', async () => {
        const fragment = await sunhex.crystallizeLocal(info, pin);
        await expect(sunhex.resolveLocal(fragment, 'wrong-pin')).rejects.toThrow();
    });

    it('should fail with invalid fragment', async () => {
        await expect(sunhex.resolveLocal('invalid-hex', pin)).rejects.toThrow();
    });
});
