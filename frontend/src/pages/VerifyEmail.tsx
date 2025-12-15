import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { verifyEmail } = useAuth();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasVerified.current) {
        return;
      }
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      hasVerified.current = true;
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying Email</h2>
              <p className="text-slate-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Email Verified!</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <Link to="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Go to Home
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Failed</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <Link to="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Go to Login
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
