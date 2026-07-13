import type { Metadata } from 'next';
import ResumeClient from './ResumeClient';

export const metadata: Metadata = {
  title: 'Resume — Abir Barman',
  description: 'View or download the resume of Abir Barman — Data Scientist & ML Engineer.',
};

export default function ResumePage() {
  return <ResumeClient />;
}
