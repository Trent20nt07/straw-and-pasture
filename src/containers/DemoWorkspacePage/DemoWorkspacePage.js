import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useConfiguration } from '../../context/configurationContext';
import { useIntl } from '../../util/reactIntl';
import {
  demoProperties,
  DEMO_HOST_ID,
  HOSTED_TEST_URL,
  hasMapProvider,
} from '../../util/demoProperties';
import { Page, LayoutSingleColumn, NamedLink } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';
import { importSamples } from './DemoWorkspacePage.duck';
import css from './DemoWorkspacePage.module.css';

/** A transparent walkthrough and authenticated, resumable Test-data import. */
const DemoWorkspacePage = () => {
  const intl = useIntl();
  const config = useConfiguration();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user.currentUser);
  const { importing, error, results, complete } = useSelector(s => s.DemoWorkspacePage);
  const m = (key, values) => intl.formatMessage({ id: `DemoWorkspace.${key}` }, values);
  const label = (key, value) =>
    config.listing.listingFields
      .find(f => f.key === key)
      ?.enumOptions?.find(o => o.option === value)?.label || value;
  return (
    <Page title={m('title')}>
      <LayoutSingleColumn
        className={css.page}
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <NamedLink name="LandingPage" className={css.back}>
            ← {m('home')}
          </NamedLink>
          <p className={css.eyebrow}>{m('eyebrow')}</p>
          <h1 className={css.heading}>{m('heading')}</h1>
          <p className={css.lede}>{m('lede')}</p>
          <div className={css.links}>
            <NamedLink name="SearchPage" className={css.primary}>
              {m('browse')}
            </NamedLink>
            <NamedLink name="NewListingPage" className={css.secondary}>
              {m('create')}
            </NamedLink>
            <Link to="/prepare-property" className={css.secondary}>
              {m('localDraft')}
            </Link>
          </div>
          <section className={css.setup}>
            <div>
              <h2 className={css.sectionTitle}>{m('importTitle')}</h2>
              <p className={css.copy}>{m('importHelp')}</p>
              {!user && (
                <NamedLink name="LoginPage" className={css.secondary}>
                  {m('hostLogin')}
                </NamedLink>
              )}
              {user?.id.uuid === DEMO_HOST_ID && (
                <button
                  className={css.primary}
                  disabled={importing}
                  onClick={() => dispatch(importSamples())}
                >
                  {m(importing ? 'importing' : 'import')}
                </button>
              )}
              {user && user.id.uuid !== DEMO_HOST_ID && (
                <p className={css.copy}>{m('designatedHost')}</p>
              )}
              {importing && <p role="status">{m('progress', { count: results.length })}</p>}
              {complete && <p role="status">{m('complete', { count: results.length })}</p>}
              {error && (
                <p role="alert" className={css.error}>
                  {m('error')}
                </p>
              )}
            </div>
            <div className={css.note}>
              <h2 className={css.sectionTitle}>{m('testTitle')}</h2>
              <p className={css.copy}>{m('testHelp')}</p>
              <NamedLink name="SignupPage" className={css.secondary}>
                {m('customer')}
              </NamedLink>
            </div>
          </section>
          <h2 className={css.sectionTitle}>{m('catalog')}</h2>
          <p className={css.copy}>{m('catalogHelp')}</p>
          <div className={css.grid}>
            {demoProperties.map(sample => {
              const result = results.find(r => r.key === sample.key);
              return (
                <article key={sample.key} className={css.card}>
                  <img
                    className={css.image}
                    src={`/static/demo-properties/${sample.key}.png`}
                    alt={m('imageAlt', { name: sample.name })}
                  />
                  <div className={css.cardBody}>
                    <span className={css.badge}>{m('sample')}</span>
                    <h3 className={css.cardTitle}>{sample.name}</h3>
                    <p className={css.city}>{sample.city}</p>
                    <p className={css.facts}>
                      {sample.animals.map(a => label('animalsAccepted', a)).join(' · ')} ·{' '}
                      {label('boardingType', sample.boarding)}
                    </p>
                    <p className={css.price}>
                      {intl.formatNumber(sample.price, {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                      <span className={css.priceUnit}> {m('perDay')}</span>
                    </p>
                    {result ? (
                      <NamedLink
                        name={result.state === 'published' ? 'ListingPage' : 'ManageListingsPage'}
                        params={
                          result.state === 'published' ? { slug: sample.key, id: result.id } : {}
                        }
                        className={css.secondary}
                      >
                        {m('viewRecord')}
                      </NamedLink>
                    ) : (
                      <p className={css.status}>{m('prepared')}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <section className={css.walkthrough}>
            <h2 className={css.sectionTitle}>{m('walkthrough')}</h2>
            <ol className={css.steps}>
              <li className={css.step}>{m('step1')}</li>
              <li className={css.step}>{m('step2')}</li>
              <li className={css.step}>{m('step3')}</li>
            </ol>
            <p className={css.copy}>
              {m(hasMapProvider(config.maps) ? 'mapsReady' : 'mapsPending')}
            </p>
            <a
              className={css.secondary}
              href={`${HOSTED_TEST_URL}/s`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {m('hostedTest')} ↗
            </a>
            <p className={css.copy}>{m('bookingPending')}</p>
          </section>
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};
export default DemoWorkspacePage;
