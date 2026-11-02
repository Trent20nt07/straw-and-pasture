import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage } from '../../util/reactIntl';
import css from './ProgressPreview.module.css';

export const isProgressPreview = process.env.REACT_APP_PROGRESS_PREVIEW === 'true';

export const isPreviewPath = pathname =>
  pathname === '/' ||
  pathname === '/s' ||
  /^\/s\//.test(pathname) ||
  /^\/l\/[^/]+\/[0-9a-f-]{36}\/?$/i.test(pathname) ||
  /^\/u\/[0-9a-f-]{36}\/?$/i.test(pathname) ||
  /^\/p\/[^/]+\/?$/.test(pathname) ||
  ['/terms-of-service', '/privacy-policy'].includes(pathname);

/** Public browsing preview only; the normal marketplace build is unaffected. */
const ProgressPreview = ({ children }) => {
  const { pathname } = useLocation();
  if (!isProgressPreview) return children;
  return (
    <>
      {isPreviewPath(pathname) ? (
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
      </aside>
    </>
  );
};

export default ProgressPreview;
