import React from 'react';
import { useIntl, FormattedMessage } from '../../util/reactIntl';
import { getBoardingDetails } from '../../util/strawPasture';
import css from './BoardingOverview.module.css';

/** Host-supplied facts and a practical checklist; never infer missing property details. */
const BoardingOverview = ({ publicData, fields }) => {
  const intl = useIntl();
  const details = getBoardingDetails(publicData, fields, intl);
  return (
    <div className={css.root}>
      <section className={css.summary}>
        <p className={css.eyebrow}>
          <FormattedMessage id="StrawPasture.propertyDetails" />
        </p>
        <h2 className={css.title}>
          <FormattedMessage id="StrawPasture.boardingOverview" />
        </h2>
        {details.length ? (
          <dl className={css.facts}>
            {details.map(detail => (
              <div className={css.fact} key={detail.key}>
                <dt className={css.label}>{detail.label}</dt>
                <dd className={css.value}>{detail.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className={css.description}>
            <FormattedMessage id="StrawPasture.detailsPending" />
          </p>
        )}
      </section>
      <section className={css.checklist}>
        <h2 className={css.checklistTitle}>
          <FormattedMessage id="StrawPasture.beforeBoarding" />
        </h2>
        <ol className={css.items}>
          {['space', 'care', 'arrival'].map((key, index) => (
            <li className={css.item} key={key}>
              <span className={css.number} aria-hidden="true">
                0{index + 1}
              </span>
              <p className={css.itemText}>
                <FormattedMessage id={`StrawPasture.confirm.${key}`} />
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
export default BoardingOverview;
