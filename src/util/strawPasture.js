import { constructQueryParamName, isFilterEnabled } from './search';

const animalNames = ['horse', 'horses', 'cattle'];
const normalize = value =>
  String(value || '')
    .toLowerCase()
    .trim();

/** Use the marketplace's configured field and option IDs; never invent a search schema. */
export const getBoardingAnimalFilter = config => {
  const fields = config?.listing?.listingFields || [];
  const field = fields.find(
    f =>
      f.scope === 'public' &&
      ['enum', 'multi-enum'].includes(f.schemaType) &&
      isFilterEnabled(f.filterConfig || {}) &&
      f.enumOptions?.some(o => animalNames.includes(normalize(o.label)))
  );
  if (!field) return null;
  const options = field.enumOptions.filter(o => animalNames.includes(normalize(o.label)));
  return { ...field, options, queryParam: constructQueryParamName(field.key, field.scope) };
};

/** Build a real Sharetribe search. Unsupported inputs are omitted, not simulated. */
export const buildBoardingSearch = (values, config) => {
  const filter = getBoardingAnimalFilter(config);
  const params = {};
  if (filter?.options.some(o => o.option === values.animal)) {
    // Native search exposes type-limited fields only after their type is selected.
    const allowedTypes = filter.listingTypeConfig?.limitToListingTypeIds
      ? config.listing.listingTypes?.filter(t =>
          filter.listingTypeConfig.listingTypeIds?.includes(t.listingType)
        )
      : [];
    if (allowedTypes?.length === 1) params.pub_listingType = allowedTypes[0].listingType;
    params[filter.queryParam] =
      filter.schemaType === 'multi-enum' ? `has_any:${values.animal}` : values.animal;
  }
  const keywordsEnabled =
    config?.search?.mainSearch?.searchType === 'keywords' ||
    config?.search?.defaultFilters?.some(f => f.schemaType === 'keywords');
  if (keywordsEnabled && values.keywords?.trim()) params.keywords = values.keywords.trim();
  const price = config?.search?.defaultFilters?.find(f => f.schemaType === 'price');
  const maxPrice = Number(values.maxPrice);
  if (
    price &&
    values.maxPrice &&
    Number.isFinite(maxPrice) &&
    maxPrice > price.min &&
    maxPrice <= price.max
  ) {
    params.price = `${price.min},${maxPrice}`;
  }
  return params;
};

const boardingKeys = [
  'animals',
  'animalsAccepted',
  'careServices',
  'animalType',
  'animalTypes',
  'animal-type',
  'boardingType',
  'boarding-type',
  'amenities',
  'services',
  'feedingProvided',
  'stallCleaningProvided',
  'acreage',
  'capacity',
];

export const getBoardingFieldNames = fields =>
  (fields || [])
    .filter(f => f.scope === 'public' && boardingKeys.includes(f.key))
    .map(f => `publicData.${f.key}`);

/** Render only published, configured details. Missing care services are never treated as false. */
export const getBoardingDetails = (publicData = {}, fields = [], intl) =>
  fields
    .filter(
      f =>
        f.scope === 'public' &&
        boardingKeys.includes(f.key) &&
        f.showConfig?.label &&
        f.showConfig.displayOnListingPage !== false
    )
    .map(f => {
      const value = publicData[f.key];
      const options = f.enumOptions || [];
      const selected = Array.isArray(value) ? value : [value];
      const values = options.filter(o => selected.includes(o.option)).map(o => o.label);
      const text = ['enum', 'multi-enum'].includes(f.schemaType)
        ? values.join(', ')
        : f.schemaType === 'boolean' && typeof value === 'boolean'
        ? intl.formatMessage({ id: value ? 'StrawPasture.included' : 'StrawPasture.notIncluded' })
        : f.schemaType === 'long' && Number.isFinite(value)
        ? intl.formatNumber(value)
        : null;
      return text ? { key: f.key, label: f.showConfig.label, value: text } : null;
    })
    .filter(Boolean);
