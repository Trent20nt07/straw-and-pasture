import React, { useState, useRef, useEffect } from 'react';
import { Form as FinalForm } from 'react-final-form';

import { useConfiguration } from '../../context/configurationContext';
import { useIntl } from '../../util/reactIntl';
import { getBoardingAnimalFilter } from '../../util/strawPasture';
import {
  browserDraftStorage,
  readBoardingDraft,
  writeBoardingDraft,
  validateBoardingDraft,
} from '../../util/boardingDraft';
import {
  Page,
  LayoutSingleColumn,
  NamedLink,
  FieldTextInput,
  FieldSelect,
  FieldCheckbox,
} from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';
import css from './HostDraftPage.module.css';

const steps = ['property', 'boarding', 'description', 'review'];

/** A device-local preparation flow, rendered only by the public progress preview. */
const HostDraftPage = () => {
  const intl = useIntl();
  const config = useConfiguration();
  const [step, setStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null);
  const [initialValues] = useState(() => readBoardingDraft(browserDraftStorage()));
  const heading = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);
  const m = (id, values) => intl.formatMessage({ id: `HostDraft.${id}` }, values);
  const listingFields = config.listing.listingFields;
  const fields = {
    animals: getBoardingAnimalFilter(config),
    boardingType: listingFields.find(f => f.scope === 'public' && f.key === 'boardingType'),
    careServices: listingFields.find(f => f.scope === 'public' && f.key === 'careServices'),
  };
  const boardingConfig = config.listing.listingTypes.find(t => t.listingType === 'animal-boarding');
  const unitType = boardingConfig?.transactionType?.unitType || 'day';
  const unitLabel = intl.formatMessage({ id: 'OrderPanel.perUnit' }, { unitType });
  const saveDraft = values =>
    setSaveStatus(writeBoardingDraft(browserDraftStorage(), values) ? 'saved' : 'saveError');
  const fieldProps = { className: css.field, inputRootClass: css.input, labelClassName: css.label };
  const selectedLabels = (field, values) =>
    field?.enumOptions
      ?.filter(o => values?.includes(o.option))
      .map(o => o.label)
      .join(', ');

  return (
    <Page title={m('pageTitle')}>
      <LayoutSingleColumn
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
        className={css.page}
      >
        <header className={css.header}>
          <NamedLink className={css.backLink} name="LandingPage">
            ← {m('backHome')}
          </NamedLink>
          <p className={css.eyebrow}>{m('eyebrow')}</p>
          <h1 className={css.heading}>{m('heading')}</h1>
          <p className={css.lede}>{m('lede')}</p>
          <p className={css.mobileNote}>{m('localNote')}</p>
        </header>
        <div className={css.layout}>
          <aside className={css.sidebar}>
            <ol className={css.steps} aria-label={m('stepsLabel')}>
              {steps.map((key, index) => (
                <li
                  className={index === step ? css.activeStep : css.step}
                  key={key}
                  aria-current={index === step ? 'step' : undefined}
                >
                  <span className={css.stepNumber}>{index + 1}</span>
                  <span>{m(`step.${key}`)}</span>
                </li>
              ))}
            </ol>
            <div className={css.sideNote}>
              <p className={css.noteTitle}>{m('draftOnly')}</p>
              <p className={css.noteText}>{m('localNote')}</p>
            </div>
          </aside>
          <FinalForm
            initialValues={initialValues}
            validate={values =>
              validateBoardingDraft(values, step, fields, {
                required: m('required'),
                chooseAnimal: m('chooseAnimal'),
                validPrice: m('validPrice'),
              })
            }
            onSubmit={values => {
              setSaveStatus(null);
              if (step < 3) setStep(step + 1);
              else saveDraft(values);
            }}
            render={({ handleSubmit, values, errors, submitFailed }) => (
              <form
                className={css.form}
                onSubmit={handleSubmit}
                onChange={() => setSaveStatus(null)}
              >
                <p className={css.progress}>{m('progress', { current: step + 1, total: 4 })}</p>
                <h2 className={css.formTitle} tabIndex={-1} ref={heading}>
                  {m(`title.${steps[step]}`)}
                </h2>
                <p className={css.formIntro}>{m(`intro.${steps[step]}`)}</p>
                {step === 0 && (
                  <>
                    <FieldTextInput
                      {...fieldProps}
                      id="draft-title"
                      name="title"
                      type="text"
                      label={m('propertyName')}
                      placeholder={m('namePlaceholder')}
                      maxLength={80}
                    />
                    <FieldTextInput
                      {...fieldProps}
                      id="draft-town"
                      name="town"
                      type="text"
                      label={m('town')}
                      placeholder={m('townPlaceholder')}
                      maxLength={120}
                    />
                    <p className={css.help}>{m('townHelp')}</p>
                  </>
                )}
                {step === 1 && (
                  <>
                    {fields.animals && (
                      <fieldset className={css.fieldset}>
                        <legend className={css.label}>{m('animals')}</legend>
                        <div className={css.options}>
                          {fields.animals.options.map(o => (
                            <FieldCheckbox
                              className={css.option}
                              key={o.option}
                              name="animals"
                              id={`draft-animal-${o.option}`}
                              value={o.option}
                              label={o.label}
                            />
                          ))}
                        </div>
                        {submitFailed && errors.animals && (
                          <p className={css.error} role="alert">
                            {errors.animals}
                          </p>
                        )}
                      </fieldset>
                    )}
                    {fields.boardingType && (
                      <FieldSelect
                        className={css.field}
                        labelClassName={css.label}
                        selectClassName={css.input}
                        id="draft-boarding-type"
                        name="boardingType"
                        label={m('boardingType')}
                      >
                        <option value="">{m('chooseOption')}</option>
                        {fields.boardingType.enumOptions.map(o => (
                          <option key={o.option} value={o.option}>
                            {o.label}
                          </option>
                        ))}
                      </FieldSelect>
                    )}
                    {fields.careServices && (
                      <fieldset className={css.fieldset}>
                        <legend className={css.label}>{m('careServices')}</legend>
                        <p className={css.help}>{m('careHelp')}</p>
                        <div className={css.options}>
                          {fields.careServices.enumOptions.map(o => (
                            <FieldCheckbox
                              className={css.option}
                              key={o.option}
                              name="careServices"
                              id={`draft-care-${o.option}`}
                              value={o.option}
                              label={o.label}
                            />
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </>
                )}
                {step === 2 && (
                  <>
                    <FieldTextInput
                      {...fieldProps}
                      id="draft-description"
                      name="description"
                      type="textarea"
                      label={m('description')}
                      placeholder={m('descriptionPlaceholder')}
                      maxLength={3000}
                    />
                    <FieldTextInput
                      {...fieldProps}
                      id="draft-price"
                      name="price"
                      type="text"
                      inputMode="decimal"
                      label={m('price', { currency: config.currency, unit: unitLabel })}
                      placeholder="0.00"
                      maxLength={12}
                    />
                    <p className={css.help}>{m('priceHelp')}</p>
                  </>
                )}
                {step === 3 && (
                  <>
                    <article className={css.previewCard}>
                      <div className={css.photoPlaceholder}>
                        <span className={css.photoIcon} aria-hidden="true">
                          ▧
                        </span>
                        <span>{m('photoReminder')}</span>
                      </div>
                      <div className={css.previewBody}>
                        <span className={css.draftBadge}>{m('draftOnly')}</span>
                        <h3 className={css.previewTitle}>{values.title}</h3>
                        <p className={css.previewTown}>{values.town}</p>
                        <p className={css.previewPrice}>
                          {intl.formatNumber(Number(values.price), {
                            style: 'currency',
                            currency: config.currency,
                          })}{' '}
                          <span className={css.priceUnit}>{unitLabel}</span>
                        </p>
                        <dl className={css.details}>
                          {[
                            ['animals', fields.animals, values.animals],
                            ['boardingType', fields.boardingType, [values.boardingType]],
                            ['careServices', fields.careServices, values.careServices],
                          ].map(([key, field, chosen]) => {
                            const label = selectedLabels(field, chosen);
                            return label ? (
                              <div className={css.detail} key={key}>
                                <dt className={css.detailLabel}>{m(key)}</dt>
                                <dd className={css.detailValue}>{label}</dd>
                              </div>
                            ) : null;
                          })}
                        </dl>
                        <p className={css.previewDescription}>{values.description}</p>
                      </div>
                    </article>
                    <div className={css.readyNote}>
                      <h3 className={css.noteTitle}>{m('nextTitle')}</h3>
                      <p className={css.noteText}>{m('nextDescription')}</p>
                    </div>
                  </>
                )}
                {saveStatus && (
                  <p className={saveStatus === 'saved' ? css.saved : css.error} role="status">
                    {m(saveStatus)}
                  </p>
                )}
                <div className={css.actions}>
                  {step > 0 && (
                    <button
                      className={css.backButton}
                      type="button"
                      onClick={() => {
                        setSaveStatus(null);
                        setStep(step - 1);
                      }}
                    >
                      {m('back')}
                    </button>
                  )}
                  <button className={css.primaryButton} type="submit">
                    {step === 3 ? m('saveDraft') : m('continue')} <span aria-hidden="true">→</span>
                  </button>
                </div>
                {step < 3 && (
                  <button
                    className={css.saveButton}
                    type="button"
                    onClick={() => saveDraft(values)}
                  >
                    {m('saveForLater')}
                  </button>
                )}
              </form>
            )}
          />
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};
export default HostDraftPage;
