/**
 * @file sampleLeads.js
 * @description Seed data for the Startup CRM Lite application.
 * These leads are used as the initialValue when no data exists in localStorage
 * (i.e., first visit or after clearing browser storage). Once the user interacts
 * with the app, localStorage takes over and this file is no longer read.
 *
 * Coverage: 2 New · 1 Contacted · 1 Won · 1 Lost · 1 Meeting Scheduled
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier.
 * @property {string} name - Full name of the contact.
 * @property {string} company - Company name.
 * @property {string} email - Contact email.
 * @property {string} phone - Contact phone number.
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source
 * @property {string} createdAt - ISO 8601 timestamp.
 * @property {string} dateAdded - ISO 8601 timestamp (alias for backward compat).
 * @property {number} value - Estimated deal value in INR.
 */

/** @type {Lead[]} */
const sampleLeads = [
  // ── Status: New ──────────────────────────────────────────────────────────
  {
    id: 'sample-1',
    name: 'Priya Sharma',
    company: 'Zenith SoftTech Pvt. Ltd.',
    email: 'priya.sharma@zenithsofttech.in',
    phone: '+91 98201 45678',
    status: 'New',
    source: 'Website',
    createdAt: '2026-06-17T09:15:00Z',
    dateAdded: '2026-06-17T09:15:00Z',
    value: 180000,
  },
  {
    id: 'sample-2',
    name: 'Arjun Mehta',
    company: 'BlueRidge Analytics',
    email: 'arjun.mehta@blueridge.io',
    phone: '+91 99302 11234',
    status: 'New',
    source: 'LinkedIn',
    createdAt: '2026-06-16T14:00:00Z',
    dateAdded: '2026-06-16T14:00:00Z',
    value: 95000,
  },

  // ── Status: Contacted ─────────────────────────────────────────────────────
  {
    id: 'sample-3',
    name: 'Kavitha Nair',
    company: 'Kochi Finserve Ltd.',
    email: 'kavitha@kochifinserve.com',
    phone: '+91 94471 67890',
    status: 'Contacted',
    source: 'Cold Call',
    createdAt: '2026-06-14T11:30:00Z',
    dateAdded: '2026-06-14T11:30:00Z',
    value: 240000,
  },

  // ── Status: Meeting Scheduled ─────────────────────────────────────────────
  {
    id: 'sample-4',
    name: 'Rohan Desai',
    company: 'Inventra Technologies',
    email: 'rohan.desai@inventra.tech',
    phone: '+91 93456 78901',
    status: 'Meeting Scheduled',
    source: 'Referral',
    createdAt: '2026-06-13T08:45:00Z',
    dateAdded: '2026-06-13T08:45:00Z',
    value: 560000,
  },

  // ── Status: Won ───────────────────────────────────────────────────────────
  {
    id: 'sample-5',
    name: 'Sneha Iyer',
    company: 'PeakDrive Logistics',
    email: 'sneha.iyer@peakdrive.co.in',
    phone: '+91 87654 32100',
    status: 'Won',
    source: 'Email Campaign',
    createdAt: '2026-06-10T13:00:00Z',
    dateAdded: '2026-06-10T13:00:00Z',
    value: 1200000,
  },

  // ── Status: Lost ──────────────────────────────────────────────────────────
  {
    id: 'sample-6',
    name: 'Vikram Pillai',
    company: 'Orbita Cloud Services',
    email: 'vikram.pillai@orbita.cloud',
    phone: '+91 96321 09876',
    status: 'Lost',
    source: 'Other',
    createdAt: '2026-06-08T10:00:00Z',
    dateAdded: '2026-06-08T10:00:00Z',
    value: 75000,
  },
];

export default sampleLeads;
