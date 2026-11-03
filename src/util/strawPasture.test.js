import {
  buildBoardingSearch,
  getBoardingAnimalFilter,
  getBoardingDetails,
  getBoardingFieldNames,
} from './strawPasture';

const animals = {
  key: 'animals',
  scope: 'public',
  schemaType: 'multi-enum',
  enumOptions: [
    { option: 'equine', label: 'Horse' },
    { option: 'bovine', label: 'Cattle' },
    { option: 'goat', label: 'Goats' },
  ],
  filterConfig: { showFilter: true },
  showConfig: { label: 'Animals' },
};
const config = {
  listing: { listingFields: [animals] },
  search: {
    mainSearch: { searchType: 'keywords' },
    defaultFilters: [{ schemaType: 'price', min: 0, max: 1000 }],
  },
};
const intl = { formatMessage: ({ id }) => id, formatNumber: v => String(v) };

describe('boarding search compatibility', () => {
  it('uses actual option IDs, excludes other animals, and preserves native price units', () => {
    expect(getBoardingAnimalFilter(config).options.map(o => o.option)).toEqual([
      'equine',
      'bovine',
    ]);
    expect(
      buildBoardingSearch({ animal: 'equine', maxPrice: '250', keywords: '  pasture  ' }, config)
    ).toEqual({ pub_animals: 'has_any:equine', price: '0,250', keywords: 'pasture' });
  });
  it('does not send unsupported or invalid filters', () => {
    expect(buildBoardingSearch({ animal: 'goat', maxPrice: '-1' }, config)).toEqual({});
    expect(buildBoardingSearch({ animal: 'equine', maxPrice: 'Infinity' }, config)).toEqual({
      pub_animals: 'has_any:equine',
    });
    expect(
      buildBoardingSearch({ animal: 'equine', keywords: 'pasture', maxPrice: '250' }, {})
    ).toEqual({});
    const disabled = {
      ...config,
      listing: { listingFields: [{ ...animals, filterConfig: { showFilter: false } }] },
    };
    expect(getBoardingAnimalFilter(disabled)).toBeNull();
    expect(buildBoardingSearch({ animal: 'equine' }, disabled)).toEqual({});
  });
  it('supports a configured single-enum animal field', () => {
    const single = { ...config, listing: { listingFields: [{ ...animals, schemaType: 'enum' }] } };
    expect(buildBoardingSearch({ animal: 'bovine' }, single)).toEqual({ pub_animals: 'bovine' });
  });
  it('selects the configured type so type-limited animal filters remain visible', () => {
    const limited = {
      ...config,
      listing: {
        listingTypes: [{ listingType: 'animal-boarding' }],
        listingFields: [
          {
            ...animals,
            listingTypeConfig: { limitToListingTypeIds: true, listingTypeIds: ['animal-boarding'] },
          },
        ],
      },
    };
    expect(buildBoardingSearch({ animal: 'equine' }, limited)).toEqual({
      pub_listingType: 'animal-boarding',
      pub_animals: 'has_any:equine',
    });
  });
});

describe('boarding details', () => {
  const feeding = {
    key: 'feedingProvided',
    scope: 'public',
    schemaType: 'boolean',
    showConfig: { label: 'Feeding' },
  };
  it('distinguishes an explicit no from missing data', () => {
    expect(getBoardingDetails({}, [feeding], intl)).toEqual([]);
    expect(getBoardingDetails({ feedingProvided: false }, [feeding], intl)[0].value).toBe(
      'StrawPasture.notIncluded'
    );
    expect(getBoardingDetails({ feedingProvided: true }, [feeding], intl)[0].value).toBe(
      'StrawPasture.included'
    );
    expect(getBoardingDetails({ feedingProvided: 'false' }, [feeding], intl)).toEqual([]);
  });
  it('uses configured labels and omits private or unrecognized fields', () => {
    expect(getBoardingDetails({ animals: ['equine', 'unknown'] }, [animals], intl)[0].value).toBe(
      'Horse'
    );
    expect(
      getBoardingDetails({ feedingProvided: true }, [{ ...feeding, scope: 'private' }], intl)
    ).toEqual([]);
    expect(
      getBoardingDetails(
        { feedingProvided: true },
        [{ ...feeding, showConfig: { label: 'Feeding', displayOnListingPage: false } }],
        intl
      )
    ).toEqual([]);
    expect(getBoardingFieldNames([animals, { ...feeding, scope: 'private' }])).toEqual([
      'publicData.animals',
    ]);
  });
});
