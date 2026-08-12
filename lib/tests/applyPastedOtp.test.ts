import { describe, expect, it } from 'vitest';

import { applyPastedOtp } from '../utils/applyPastedOtp';

describe('applyPastedOtp', () => {
  it('fills the code with pasted digits', () => {
    const result = applyPastedOtp(['', '', '', '', '', ''], '123456', 6);

    expect(result).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('ignores non-digit characters', () => {
    const result = applyPastedOtp(['', '', '', '', '', ''], '12a3-b', 6);

    expect(result).toEqual(['1', '2', '3', '', '', '']);
  });

  it('truncates pasted value to the specified length', () => {
    const result = applyPastedOtp(['', '', '', '', '', ''], '123456789', 6);

    expect(result).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('returns the original value when pasted text has no digits', () => {
    const currentValue = ['1', '', '', '', '', ''];

    const result = applyPastedOtp(currentValue, 'abc', 6);

    expect(result).toBe(currentValue);
  });

  it('works with a custom OTP length', () => {
    const result = applyPastedOtp(['', '', '', ''], '987654', 4);

    expect(result).toEqual(['9', '8', '7', '6']);
  });

  it('preserves remaining digits after the pasted part', () => {
    const result = applyPastedOtp(['1', '2', '3', '4', '5', '6'], '99', 6);

    expect(result).toEqual(['9', '9', '3', '4', '5', '6']);
  });
});
