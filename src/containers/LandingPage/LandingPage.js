import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import loadable from '@loadable/component';

import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { useIntl } from '../../util/reactIntl';
import { camelize } from '../../util/string';
import { propTypes } from '../../util/types';

import LogoReveal from '../../components/LogoReveal/LogoReveal';

import FallbackPage from './FallbackPage';
import StrawPastureIntro from '../../components/StrawPastureIntro/StrawPastureIntro';
import { ASSET_NAME } from './LandingPage.duck';
import { fetchFeaturedListings } from '../../ducks/featuredListings.duck';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { getFeaturedListingsProps } from '../../util/data';

const PageBuilder = loadable(() =>
  import(/* webpackChunkName: "PageBuilder" */ '../PageBuilder/PageBuilder')
);

export const INTRO_SEEN_KEY = 'straw-pasture-intro-seen-v1';

export const LandingPageComponent = props => {
  const { pageAssetsData, inProgress, error } = props;
  const intl = useIntl();
  const history = useHistory();
  const [showIntro, setShowIntro] = useState(false);
  const checkedIntro = useRef(false);
  const finishIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch (_) {
      /* Storage is optional. */
    }
    setShowIntro(false);
    if (props.forceIntro) history.replace('/');
  }, [history, props.forceIntro]);
  useEffect(() => {
    if (checkedIntro.current || inProgress || error) return;
    checkedIntro.current = true;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    } catch (_) {
      /* Still allow entry. */
    }
    if (reducedMotion) finishIntro();
    else if (props.forceIntro || !seen) setShowIntro(true);
  }, [inProgress, error, props.forceIntro, finishIntro]);

  return (
    <>
      <div aria-hidden={showIntro ? true : undefined} inert={showIntro ? '' : undefined}>
        <PageBuilder
          title={intl.formatMessage({ id: 'StrawPasture.pageTitle' })}
          description={intl.formatMessage({ id: 'StrawPasture.lede' })}
          pageAssetsData={pageAssetsData?.[camelize(ASSET_NAME)]?.data}
          inProgress={inProgress}
          error={error}
          fallbackPage={<FallbackPage error={error} />}
          mainContent={
            <StrawPastureIntro
              recentListings={props.recentListings}
              recentListingsLoading={props.recentListingsLoading}
              recentListingsError={props.recentListingsError}
            />
          }
          featuredListings={getFeaturedListingsProps(camelize(ASSET_NAME), props)}
        />
      </div>
      {showIntro && <LogoReveal onComplete={finishIntro} />}
    </>
  );
};

LandingPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
  error: propTypes.error,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  const featuredListingData = state.featuredListings || {};

  const getListingEntitiesById = listingIds => getListingsById(state, listingIds);

  const { recentListingIds = [], recentListingsLoading, recentListingsError } =
    state.LandingPage || {};
  return {
    pageAssetsData,
    featuredListingData,
    getListingEntitiesById,
    inProgress,
    error,
    recentListings: getListingsById(state, recentListingIds),
    recentListingsLoading,
    recentListingsError,
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchFeaturedListings: (sectionId, parentPage, listingImageConfig, allSections) =>
    dispatch(fetchFeaturedListings({ sectionId, parentPage, listingImageConfig, allSections })),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LandingPageComponent);

export default LandingPage;
