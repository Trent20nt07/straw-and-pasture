import React, { useEffect, useId, useRef, useState } from 'react';
import { useIntl } from '../../util/reactIntl';
import logo from '../../assets/straw-pasture/round-logo.png';
import css from './LogoReveal.module.css';

// Complementary SVG masks animate the original artwork without redrawing its mark.
const PIN =
  'M582 100 C425 100 306 220 306 374 C306 478 385 575 445 676 C505 777 552 868 582 940 C615 854 665 762 724 663 C786 558 857 472 857 374 C857 220 738 100 582 100Z';

/** A short, dismissible logo reveal over the real homepage. */
const LogoReveal = ({ onComplete }) => {
  const intl = useIntl();
  const id = useId().replace(/:/g, '');
  const [ready, setReady] = useState(false);
  const skip = useRef(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skip.current?.focus({ preventScroll: true });
    // Broken artwork or disabled CSS must never trap someone on the entrance.
    const timer = window.setTimeout(onComplete, 6000);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);
  return (
    <div
      className={`${css.overlay} ${ready ? css.playing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={intl.formatMessage({ id: 'LogoReveal.label' })}
      onKeyDown={e => {
        if (e.key === 'Escape') onComplete();
      }}
    >
      <img
        className={css.preload}
        src={logo}
        alt=""
        aria-hidden="true"
        onLoad={() => setReady(true)}
        onError={onComplete}
      />
      <div className={css.light} aria-hidden="true" />
      <div
        className={css.assembly}
        aria-hidden="true"
        onAnimationEnd={e => {
          if (e.target === e.currentTarget) onComplete();
        }}
      >
        <div className={css.glass} />
        <svg className={css.artwork} viewBox="0 0 1181 1181" focusable="false">
          <defs>
            <clipPath id={`${id}-disc`}>
              <circle cx="590" cy="594" r="587" />
            </clipPath>
            <clipPath id={`${id}-pin`}>
              <path d={PIN} />
            </clipPath>
            <mask
              id={`${id}-base`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1181"
              height="1181"
            >
              <rect width="1181" height="1181" fill="white" />
              <path d={PIN} fill="black" />
              {/* Hide the curved URL while preserving the original gold artwork. */}
              <path
                d="M1094 610 A505 505 0 0 1 735 1077"
                fill="none"
                stroke="black"
                strokeWidth="80"
                strokeLinecap="round"
              />
            </mask>
          </defs>
          <g className={css.circle} clipPath={`url(#${id}-disc)`}>
            <circle cx="590" cy="594" r="587" fill="#25572a" />
            <image href={logo} width="1181" height="1181" mask={`url(#${id}-base)`} />
          </g>
          <g className={css.pin}>
            <image href={logo} width="1181" height="1181" clipPath={`url(#${id}-pin)`} />
          </g>
        </svg>
      </div>
      <button ref={skip} type="button" className={css.skip} onClick={onComplete}>
        {intl.formatMessage({ id: 'LogoReveal.skip' })}
        <span aria-hidden="true"> →</span>
      </button>
    </div>
  );
};
export default LogoReveal;
