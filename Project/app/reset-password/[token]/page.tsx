'use client';

import { useParams } from 'next/navigation';
import ResetPasswordUI from '../../../components/ResetPassword';

export default function ResetPasswordPage() {
  // Use client-side navigation to access the token parameter
  const params = useParams();
  const token = params?.token as string;

  return <ResetPasswordUI token={token} />;
} 