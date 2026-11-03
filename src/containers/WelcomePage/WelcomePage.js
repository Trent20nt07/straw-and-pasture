import React from 'react';

import { useConfiguration } from '../../context/configurationContext';
import { useIntl } from '../../util/reactIntl';
import { Page, NamedLink } from '../../components';
import pastureImage from '../../assets/straw-pasture/pasture.jpg';
import css from './WelcomePage.module.css';

/** Optional branded entrance. Links work immediately and never delay marketplace access. */
const WelcomePage = () => {
  const intl = useIntl();
  const config = useConfiguration();
  const m = key => intl.formatMessage({ id: `WelcomePage.${key}` });
  const logo = config.branding?.logoImageDesktop;
  const logoSrc =
    typeof logo === 'string'
      ? logo
      : logo?.attributes?.variants?.scaled2x?.url || logo?.attributes?.variants?.scaled?.url;
  return (
    <Page title={m('title')} description={m('description')}>
      <main className={css.page}>
        <div className={css.scene}>
          <img className={css.landscape} src={pastureImage} alt="" />
          <div className={css.shade} />
          <header className={css.header}>
            <NamedLink name="LandingPage" className={css.brand}>
              {logoSrc && <img className={css.logo} src={logoSrc} alt="" />}
              <span className={css.wordmark}>Straw &amp; Pasture</span>
            </NamedLink>
            <NamedLink name="LoginPage" className={css.signIn}>
              {m('signIn')} <span aria-hidden="true">↗</span>
            </NamedLink>
          </header>
          <div className={css.content}>
            <p className={css.eyebrow}>
              <span className={css.rule} aria-hidden="true" />
              {m('eyebrow')}
            </p>
            <h1 className={css.heading}>
              {m('headline')}
              <br />
              <span className={css.accent}>{m('headlineAccent')}</span>
            </h1>
            <p className={css.description}>{m('description')}</p>
            <div className={css.actions}>
              <NamedLink name="LandingPage" className={css.enter}>
                {m('enter')} <span aria-hidden="true">→</span>
              </NamedLink>
              <NamedLink name="SearchPage" className={css.browse}>
                {m('browse')} <span aria-hidden="true">↗</span>
              </NamedLink>
            </div>
          </div>
          <p className={css.photoNote}>{m('photoNote')}</p>
        </div>
        <footer className={css.footer}>
          <div className={css.footerIntro}>
            <span className={css.footerLabel}>{m('footerLabel')}</span>
            <p className={css.footerText}>{m('footerText')}</p>
          </div>
          <NamedLink name="NewListingPage" className={css.host}>
            {m('host')} <span aria-hidden="true">↗</span>
          </NamedLink>
        </footer>
      </main>
    </Page>
  );
};
export default WelcomePage;
