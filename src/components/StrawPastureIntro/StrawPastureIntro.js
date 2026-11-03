import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { useIntl, FormattedMessage } from '../../util/reactIntl';
import { createResourceLocatorString } from '../../util/routes';
import { buildBoardingSearch, getBoardingAnimalFilter } from '../../util/strawPasture';
import { FieldSelect, FieldTextInput, Form, NamedLink, ListingCard } from '../../components';
import pastureImage from '../../assets/straw-pasture/pasture.jpg';

import css from './StrawPastureIntro.module.css';

/** Branded boarding entry point, using native routes and configured Sharetribe search. */
const StrawPastureIntro = ({
  recentListings = [],
  recentListingsLoading = false,
  recentListingsError = null,
}) => {
  const intl = useIntl();
  const config = useConfiguration();
  const routes = useRouteConfiguration();
  const history = useHistory();
  const animalFilter = getBoardingAnimalFilter(config);
  const keywordSearch =
    config.search?.mainSearch?.searchType === 'keywords' ||
    config.search?.defaultFilters?.some(f => f.schemaType === 'keywords');
  const priceFilter = config.search?.defaultFilters?.find(f => f.schemaType === 'price');
  const prices = [100, 250, 500, 1000].filter(p => p > priceFilter?.min && p <= priceFilter?.max);
  const message = id => intl.formatMessage({ id: `StrawPasture.${id}` });
  const onSubmit = values =>
    history.push(
      createResourceLocatorString('SearchPage', routes, {}, buildBoardingSearch(values, config))
    );

  return (
    <div className={css.intro}>
      <section className={css.hero} aria-labelledby="straw-pasture-title">
        <img className={css.heroImage} src={pastureImage} alt={message('heroAlt')} />
        <div className={css.heroShade} />
        <div className={css.heroContent}>
          <p className={css.eyebrow}>{message('eyebrow')}</p>
          <h1 id="straw-pasture-title" className={css.heading}>
            {message('headline')} <span className={css.accent}>{message('headlineAccent')}</span>
          </h1>
          <p className={css.lede}>{message('lede')}</p>
          <NamedLink className={css.heroLink} name="SearchPage">
            {message('browse')} <span aria-hidden="true">↗</span>
          </NamedLink>
        </div>
        <span className={css.imageNote}>{message('imageNote')}</span>
      </section>

      <div className={css.inner}>
        <FinalForm
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <Form
              className={css.searchForm}
              onSubmit={handleSubmit}
              enforcePagePreloadFor="SearchPage"
            >
              <div className={css.searchIntro}>
                <span className={css.searchTitle}>{message('findBoarding')}</span>
                <span className={css.searchHint}>{message('searchHint')}</span>
              </div>
              {animalFilter && (
                <FieldSelect
                  className={css.field}
                  labelClassName={css.fieldLabel}
                  selectClassName={css.input}
                  id="boarding-animal"
                  name="animal"
                  label={message('animal')}
                >
                  <option value="">{message('allAnimals')}</option>
                  {animalFilter.options.map(o => (
                    <option key={o.option} value={o.option}>
                      {o.label}
                    </option>
                  ))}
                </FieldSelect>
              )}
              {keywordSearch && (
                <FieldTextInput
                  className={css.field}
                  inputRootClass={css.input}
                  id="boarding-keywords"
                  name="keywords"
                  type="text"
                  label={message('keywords')}
                  placeholder={message('keywordsPlaceholder')}
                />
              )}
              {!!prices.length && (
                <FieldSelect
                  className={css.field}
                  labelClassName={css.fieldLabel}
                  selectClassName={css.input}
                  id="boarding-budget"
                  name="maxPrice"
                  label={message('budget')}
                >
                  <option value="">{message('anyPrice')}</option>
                  {prices.map(price => (
                    <option key={price} value={price}>
                      {intl.formatMessage(
                        { id: 'StrawPasture.upToPrice' },
                        {
                          price: intl.formatNumber(price, {
                            style: 'currency',
                            currency: config.currency,
                            maximumFractionDigits: 0,
                          }),
                        }
                      )}
                    </option>
                  ))}
                </FieldSelect>
              )}
              <button className={css.searchButton} type="submit">
                {message('search')} <span aria-hidden="true">→</span>
              </button>
            </Form>
          )}
        />

        <section className={css.discover} aria-labelledby="boarding-title">
          <div className={css.sectionHeading}>
            <div>
              <p className={css.kicker}>{message('roomToRoam')}</p>
              <h2 id="boarding-title" className={css.sectionTitle}>
                {message('boardingTitle')}
              </h2>
            </div>
            <NamedLink className={css.textLink} name="SearchPage">
              {message('viewAll')} <span aria-hidden="true">→</span>
            </NamedLink>
          </div>
          <div className={css.categoryGrid}>
            {['horse', 'cattle'].map((animal, index) => {
              const option = animalFilter?.options.find(o =>
                o.label.toLowerCase().startsWith(animal)
              );
              return (
                <article className={css.categoryCard} key={animal}>
                  <span className={css.categoryNumber}>0{index + 1}</span>
                  <div>
                    <h3 className={css.categoryTitle}>{message(`${animal}Title`)}</h3>
                    <p className={css.categoryDescription}>{message(`${animal}Description`)}</p>
                  </div>
                  {option && (
                    <NamedLink
                      name="SearchPage"
                      className={css.categoryLink}
                      to={{
                        search: new URLSearchParams(
                          buildBoardingSearch({ animal: option.option }, config)
                        ).toString(),
                      }}
                      ariaLabel={message(`${animal}Browse`)}
                    >
                      <span aria-hidden="true">↗</span>
                    </NamedLink>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section
          className={css.recentSection}
          aria-labelledby="recent-boarding-title"
          aria-busy={recentListingsLoading}
        >
          <div className={css.sectionHeading}>
            <div>
              <p className={css.kicker}>{message('recentLabel')}</p>
              <h2 id="recent-boarding-title" className={css.sectionTitle}>
                {message('recentTitle')}
              </h2>
            </div>
            <NamedLink className={css.textLink} name="SearchPage">
              {message('viewAll')} <span aria-hidden="true">→</span>
            </NamedLink>
          </div>
          {recentListingsLoading ? (
            <p className={css.recentStatus} role="status">
              {message('loading')}
            </p>
          ) : recentListingsError ? (
            <p className={css.recentStatus} role="status">
              {message('recentError')} <NamedLink name="SearchPage">{message('browse')}</NamedLink>
            </p>
          ) : recentListings.length ? (
            <ul className={css.recentGrid}>
              {recentListings.map(listing => (
                <li className={css.recentCard} key={listing.id.uuid}>
                  <ListingCard
                    listing={listing}
                    showBoardingDetails
                    renderSizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className={css.recentEmpty}>
              <p className={css.emptyTitle}>{message('emptyTitle')}</p>
              <p className={css.emptyDescription}>{message('emptyDescription')}</p>
              <NamedLink className={css.textLink} name="NewListingPage">
                {message('listProperty')} →
              </NamedLink>
            </div>
          )}
        </section>

        <section className={css.stepsSection} aria-labelledby="how-it-works-title">
          <div className={css.stepsIntro}>
            <p className={css.kicker}>{message('howLabel')}</p>
            <h2 id="how-it-works-title" className={css.sectionTitle}>
              {message('howTitle')}
            </h2>
          </div>
          <ol className={css.steps}>
            {['find', 'compare', 'connect'].map((step, i) => (
              <li className={css.step} key={step}>
                <span className={css.stepNumber}>0{i + 1}</span>
                <h3 className={css.stepTitle}>{message(`${step}Title`)}</h3>
                <p className={css.stepDescription}>{message(`${step}Description`)}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className={css.hostSection} aria-labelledby="host-title">
          <div>
            <p className={css.hostKicker}>{message('hostLabel')}</p>
            <h2 id="host-title" className={css.hostTitle}>
              {message('hostTitle')}
            </h2>
            <p className={css.hostDescription}>{message('hostDescription')}</p>
          </div>
          <NamedLink name="NewListingPage" className={css.hostButton}>
            {message('listProperty')} <span aria-hidden="true">↗</span>
          </NamedLink>
        </section>
        <p className={css.futureNote}>
          <FormattedMessage id="StrawPasture.futureNote" />
        </p>
      </div>
    </div>
  );
};
export default StrawPastureIntro;
