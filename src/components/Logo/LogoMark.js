import React, { useId } from 'react';
import logo from '../../assets/straw-pasture/round-logo.png';
const PIN =
  'M582 100 C425 100 306 220 306 374 C306 478 385 575 445 676 C505 777 552 868 582 940 C615 854 665 762 724 663 C786 558 857 472 857 374 C857 220 738 100 582 100Z';

/** Original artwork with the website lettering masked out. */
export default function LogoMark({ className, circleClassName, pinClassName, label }) {
 const id = useId().replace(/:/g, '');
 return (
        <svg className={className} data-brand-mark="true" aria-label={label} role={label ? 'img' : undefined} aria-hidden={label ? undefined : true} viewBox="0 0 1181 1181" focusable="false">
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
          <g className={circleClassName} clipPath={`url(#${id}-disc)`}>
            <circle cx="590" cy="594" r="587" fill="#25572a" />
            <image href={logo} width="1181" height="1181" mask={`url(#${id}-base)`} />
          </g>
          <g className={pinClassName}>
            <image href={logo} width="1181" height="1181" clipPath={`url(#${id}-pin)`} />
          </g>
        </svg>
 );
}
