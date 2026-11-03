import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useIntl } from '../../util/reactIntl';
import { Page, LayoutSingleColumn, NamedLink } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';
import { fetchDashboard } from './MemberDashboardPage.duck';
import css from './MemberDashboardPage.module.css';

/** Account-specific operational totals from Sharetribe Test, never fabricated analytics. */
export default function MemberDashboardPage() {
  const { role } = useParams();
  const host = role === 'host';
  const intl = useIntl();
  const dispatch = useDispatch();
  const data = useSelector(s => s.MemberDashboardPage);
  const m = key => intl.formatMessage({ id: `MemberDashboard.${key}` });
  const listings = data.listings || [];
  const tx = data.transactions || [];
  const metrics = host ? [
    ['published', listings.filter(l => l.attributes.state === 'published').length],
    ['drafts', listings.filter(l => l.attributes.state === 'draft').length],
    ['conversations', tx.length],
  ] : [
    ['conversations', tx.length],
    ['inquiries', tx.filter(t => /inquire/.test(t.attributes.lastTransition || '')).length],
    ['requests', tx.filter(t => !/inquire/.test(t.attributes.lastTransition || '')).length],
  ];
  return <Page title={m(host ? 'host' : 'buyer')}>
    <LayoutSingleColumn topbar={<TopbarContainer />} footer={<FooterContainer />}>
      <main className={css.content}>
        <p className={css.eyebrow}>{m('eyebrow')}</p>
        <div className={css.headingRow}><h1 className={css.heading}>{m(host ? 'host' : 'buyer')}</h1>
          <Link className={css.secondary} to="/demo">{m('workspace')}</Link></div>
        <nav className={css.tabs} aria-label={m('roles')}>
          <Link className={host ? css.active : css.tab} to="/dashboard/host" aria-current={host ? 'page' : undefined}>{m('host')}</Link>
          <Link className={!host ? css.active : css.tab} to="/dashboard/buyer" aria-current={!host ? 'page' : undefined}>{m('buyer')}</Link>
        </nav>
        <p className={css.note}>{m('source')}</p>
        {data.loading ? <p role="status">{m('loading')}</p> : data.error ? <div role="alert"><p>{m('error')}</p><button className={css.primary} onClick={() => dispatch(fetchDashboard(role))}>{m('retry')}</button></div> : <>
          <section className={css.metrics} aria-label={m('summary')}>{metrics.map(([label, value]) => <div className={css.metric} key={label}><span className={css.number}>{value}</span><span>{m(label)}</span></div>)}</section>
          <section className={css.panel}><div className={css.headingRow}><h2>{m(host ? 'properties' : 'activity')}</h2><NamedLink className={css.secondary} name={host ? 'ManageListingsPage' : 'InboxPage'} params={host ? {} : {tab:'orders'}}>{m(host ? 'manage' : 'inbox')}</NamedLink></div>
            {host ? listings.length ? <ul className={css.list}>{listings.map(l => <li className={css.row} key={l.id.uuid}><span>{l.attributes.title}</span><span className={css.badge}>{m(l.attributes.state === 'published' ? 'publishedState' : l.attributes.state === 'draft' ? 'draftState' : 'reviewState')}</span></li>)}</ul> : <p>{m('noListings')}</p> : tx.length ? <p>{m('activityHelp')}</p> : <p>{m('noActivity')}</p>}
            <div className={css.actions}><NamedLink className={css.primary} name={host ? 'NewListingPage' : 'SearchPage'}>{m(host ? 'newListing' : 'browse')}</NamedLink><NamedLink className={css.secondary} name="InboxPage" params={{tab:host ? 'sales' : 'orders'}}>{m('inbox')}</NamedLink></div>
          </section>
          <section className={css.panel}><h2>{m('analytics')}</h2><p>{m('analyticsHelp')}</p><p className={css.note}>{m('payments')}</p></section>
        </>}
      </main>
    </LayoutSingleColumn>
  </Page>;
}
