import {
  BOARDING_DRAFT_KEY,
  readBoardingDraft,
  writeBoardingDraft,
  validateBoardingDraft,
} from './boardingDraft';

describe('device-local boarding drafts', () => {
  it('round-trips draft fields and omits unrelated data', () => {
    const storage = { setItem: jest.fn(), getItem: jest.fn() };
    expect(
      writeBoardingDraft(storage, {
        title: 'North pasture',
        price: '25',
        animals: ['horse'],
        token: 'unrelated',
      })
    ).toBe(true);
    const [key, value] = storage.setItem.mock.calls[0];
    expect(key).toBe(BOARDING_DRAFT_KEY);
    expect(JSON.parse(value).values.token).toBeUndefined();
    storage.getItem.mockReturnValue(value);
    expect(readBoardingDraft(storage)).toMatchObject({
      title: 'North pasture',
      price: '25',
      animals: ['horse'],
    });
  });
  it('survives corrupted, old, and unavailable storage without losing in-memory edits', () => {
    expect(readBoardingDraft({ getItem: () => 'broken' }).title).toBe('');
    expect(
      readBoardingDraft({ getItem: () => '{"version":9,"values":{"title":"old"}}' }).title
    ).toBe('');
    expect(
      writeBoardingDraft(
        {
          setItem: () => {
            throw new Error('quota');
          },
        },
        { title: 'Keep me' }
      )
    ).toBe(false);
  });
  it('rejects invented animal options and invalid prices before review', () => {
    const fields = { animals: { enumOptions: [{ option: 'horse' }] } };
    const messages = { required: 'required', chooseAnimal: 'animal', validPrice: 'price' };
    expect(validateBoardingDraft({ animals: ['goat'] }, 1, fields, messages).animals).toBe(
      'animal'
    );
    for (const price of ['-5', '0', 'Infinity', '25.001', '1e4']) {
      expect(
        validateBoardingDraft({ description: 'Pasture', price }, 2, fields, messages).price
      ).toBe('price');
    }
    expect(
      validateBoardingDraft({ description: 'Pasture', price: '25.50' }, 2, fields, messages)
    ).toEqual({});
  });
});
