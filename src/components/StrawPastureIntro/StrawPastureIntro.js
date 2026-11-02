import React from 'react';
import css from './StrawPastureIntro.module.css';

/**
 * First-stage brand introduction.
 * This module is presentation-only: existing Sharetribe search, authentication,
 * booking, listings, and transaction logic remain owned by the Web Template.
 */
const sections = [
  {
    title: 'Find boarding',
    description: 'Explore land, pastures, and stables suited to your animals.',
    href: '/s',
    label: 'Browse listings',
  },
  {
    title: 'Farm experiences',
    description: 'Discover hands-on experiences with local agricultural hosts.',
    href: '/s',
    label: 'Explore listings',
  },
  {
    title: 'Agricultural marketplace',
    description: 'Connect with people offering farm goods and services.',
    href: '/s',
    label: 'Find goods & services',
  },
];

const StrawPastureIntro = () => (
  <section className={css.intro} aria-labelledby="straw-pasture-title">
    <div className={css.inner}>
      <p className={css.eyebrow}>STRAW &amp; PASTURE</p>
      <h1 id="straw-pasture-title" className={css.heading}>
        Access agriculture. <span>Anywhere.</span>
      </h1>
      <p className={css.lede}>
        A single place to discover animal boarding, genuine farm experiences,
        and the people and services that keep agriculture moving.
      </p>
      <div className={css.grid}>
        {sections.map(section => (
          <article className={css.card} key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <a href={section.href}>{section.label} <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>
      <p className={css.note}>
        Explore the marketplace below. Experiences and goods-and-services filtering
        are being developed; the links currently open the general listing search.
      </p>
    </div>
  </section>
);

export default StrawPastureIntro;
