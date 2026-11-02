import React from 'react';
import { useConfiguration } from '../../context/configurationContext';
import { useIntl } from '../../util/reactIntl';
import { getBoardingDetails } from '../../util/strawPasture';
import css from './BoardingDetails.module.css';

/** A factual summary of the boarding details supplied by the host. */
const BoardingDetails = ({ publicData, compact = false }) => {
  const config = useConfiguration();
  const intl = useIntl();
  const details = getBoardingDetails(publicData, config.listing.listingFields, intl);
  if (!details.length) return null;
  return (
    <dl className={compact ? css.compact : css.details}>
      {details.slice(0, compact ? 3 : details.length).map(detail => (
        <div className={css.item} key={detail.key}>
          <dt className={css.label}>{detail.label}</dt>
          <dd className={css.value}>{detail.value}</dd>
        </div>
      ))}
    </dl>
  );
};
export default BoardingDetails;
