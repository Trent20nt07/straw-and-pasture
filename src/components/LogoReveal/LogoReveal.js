import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from '../../util/reactIntl';
import logo from '../../assets/straw-pasture/round-logo.png';
import LogoMark from '../Logo/LogoMark';
import css from './LogoReveal.module.css';

/** A short, dismissible logo reveal over the real homepage. */
const LogoReveal = ({ onComplete }) => {
  const intl = useIntl();
  const [ready, setReady] = useState(false);
  const assembly = useRef(null);
  const [destination, setDestination] = useState({});
  useEffect(() => {
    const measure = () => {
      const target = [...document.querySelectorAll('#logo-topbar-desktop [data-brand-mark], #logo-topbar-mobile [data-brand-mark]')]
        .find(el => el.getBoundingClientRect().width > 0);
      const from = assembly.current?.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      if (from && to) setDestination({
        '--logo-x': `${to.x + to.width / 2 - window.innerWidth / 2}px`,
        '--logo-y': `${to.y + to.height / 2 - window.innerHeight / 2}px`,
        '--logo-scale': `${to.width / Math.min(window.innerWidth * .64, 360)}`,
      });
    };
    measure();
    const timer = window.setTimeout(measure, 1800);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measure); };
  }, [ready]);
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
        ref={assembly}
        style={destination}
        className={css.assembly}
        aria-hidden="true"
        onAnimationEnd={e => {
          if (e.target === e.currentTarget) onComplete();
        }}
      >
        <div className={css.glass} />
        <LogoMark className={css.artwork} circleClassName={css.circle} pinClassName={css.pin} />
      </div>
      <button ref={skip} type="button" className={css.skip} onClick={onComplete}>
        {intl.formatMessage({ id: 'LogoReveal.skip' })}
        <span aria-hidden="true"> →</span>
      </button>
    </div>
  );
};
export default LogoReveal;
