export const BOARDING_DRAFT_KEY = 'straw-pasture:boarding-draft:v1';

export const browserDraftStorage = () => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch (_) {
    return undefined;
  }
};

/** Keep local drafts bounded and separate from published marketplace inventory. */
export const cleanBoardingDraft = (raw = {}) => {
  if (!raw || typeof raw !== 'object') raw = {};
  const text = (key, max) => (typeof raw[key] === 'string' ? raw[key].slice(0, max) : '');
  const options = key =>
    Array.isArray(raw[key]) ? raw[key].filter(v => typeof v === 'string').slice(0, 20) : [];
  return {
    title: text('title', 80),
    town: text('town', 120),
    description: text('description', 3000),
    price: text('price', 12),
    boardingType: text('boardingType', 100),
    animals: options('animals'),
    careServices: options('careServices'),
  };
};

export const readBoardingDraft = storage => {
  try {
    const data = JSON.parse(storage.getItem(BOARDING_DRAFT_KEY));
    return data?.version === 1 && data?.values && typeof data.values === 'object'
      ? cleanBoardingDraft(data.values)
      : cleanBoardingDraft();
  } catch (_) {
    return cleanBoardingDraft();
  }
};

export const writeBoardingDraft = (storage, values) => {
  try {
    storage.setItem(
      BOARDING_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        values: cleanBoardingDraft(values),
      })
    );
    return true;
  } catch (_) {
    return false;
  }
};

export const validateBoardingDraft = (values, step, fields, messages) => {
  const errors = {};
  if (step === 0 || step === 3) {
    if (!values.title?.trim()) errors.title = messages.required;
    if (!values.town?.trim()) errors.town = messages.required;
  }
  if (step === 1 || step === 3) {
    if (
      fields.animals &&
      !values.animals?.some(v => fields.animals.enumOptions.some(o => o.option === v))
    ) {
      errors.animals = messages.chooseAnimal;
    }
    if (
      fields.boardingType &&
      !fields.boardingType.enumOptions.some(o => o.option === values.boardingType)
    ) {
      errors.boardingType = messages.required;
    }
  }
  if (step === 2 || step === 3) {
    if (!values.description?.trim()) errors.description = messages.required;
    if (!/^\d+(\.\d{1,2})?$/.test(values.price || '') || Number(values.price) <= 0)
      errors.price = messages.validPrice;
  }
  return errors;
};
