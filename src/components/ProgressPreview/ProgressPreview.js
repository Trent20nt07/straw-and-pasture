import React from 'react';
import loadable from '@loadable/component';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage } from '../../util/reactIntl';
import css from './ProgressPreview.module.css';
const HostDraftPage = loadable(() => import('../../containers/HostDraftPage/HostDraftPage'));
const DemoWorkspacePage = loadable(() =>
  import('../../containers/DemoWorkspacePage/DemoWorkspacePage')
);

export const isProgressPreview = process.env.REACT_APP_PROGRESS_PREVIEW === 'true';

export const isPreviewPath = pathname =>
  pathname === '/' ||
  pathname === '/welcome' ||
  pathname === '/s' ||
  /^\/s\//.test(pathname) ||
  /^\/l\/[^/]+\/[0-9a-f-]{36}\/?$/i.test(pathname) ||
  /^\/u\/[0-9a-f-]{36}\/?$/i.test(pathname) ||
  /^\/p\/[^/]+\/?$/.test(pathname) ||
  /^\/signup\/[a-z0-9-]+\/?$/i.test(pathname) ||
  /^\/inbox\/(orders|sales)\/?$/.test(pathname) ||
  /^\/(order|sale)\/[0-9a-f-]{36}(\/details)?\/?$/i.test(pathname) ||
  /^\/l\/[^/]+\/[0-9a-f-]{36}\/(new|draft|edit)\/(details|location|pricing|availability|photos)\/?$/i.test(
    pathname
  ) ||
  /^\/l\/[^/]+\/[0-9a-f-]{36}\/(draft|pending-approval|closed)\/?$/i.test(pathname) ||
  [
    '/terms-of-service',
    '/privacy-policy',
    '/login',
    '/signup',
    '/confirm',
    '/recover-password',
    '/reset-password',
    '/verify-email',
    '/profile-settings',
    '/inbox',
    '/listings',
    '/l/new',
    '/account',
    '/account/contact-details',
    '/account/change-password',
  ].includes(pathname);

/** Test-only browser flows. Payments and server-dependent routes remain gated. */
const ProgressPreview = ({ children }) => {
  const { pathname } = useLocation();
  if (!isProgressPreview) return children;
  return (
    <div className={css.previewContent}>
      {pathname === '/prepare-property' ? (
        <HostDraftPage />
      ) : pathname === '/demo' ? (
        <DemoWorkspacePage />
      ) : isPreviewPath(pathname) ? (
        children
      ) : (
        <main className={css.gate}>
          <p className={css.brand}>Straw &amp; Pasture</p>
          <h1>
            <FormattedMessage id="StrawPasture.previewTitle" />
          </h1>
          <p>
            <FormattedMessage id="StrawPasture.previewDetails" />
          </p>
          <Link className={css.link} to="/s">
            <FormattedMessage id="StrawPasture.browse" />
          </Link>
        </main>
      )}
      <aside className={css.notice} aria-label="Progress preview">
        <FormattedMessage id="StrawPasture.previewNotice" />
        {' · '}
        <Link className={css.noticeLink} to="/demo">
          <FormattedMessage id="DemoWorkspace.open" />
        </Link>
      </aside>
    </div>
  );
};

export default ProgressPreview;
