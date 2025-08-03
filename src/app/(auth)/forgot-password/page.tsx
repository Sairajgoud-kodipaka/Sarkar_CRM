'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual password reset logic with Supabase
      console.log('Password reset request:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-navy-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Check Your Email</h1>
            <p className="text-navy-600">We've sent you a password reset link</p>
          </div>

          {/* Success Card */}
          <Card className="shadow-soft border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-navy-900">Reset Link Sent</h3>
                  <p className="text-navy-600 text-sm">
                    We've sent a password reset link to your email address. 
                    Please check your inbox and follow the instructions.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-medium"
                  >
                    Back to Login
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="w-full h-11 border-navy-200 hover:bg-navy-50"
                  >
                    Send Another Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-navy-500">
              © 2024 Sarkar CRM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-navy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Forgot Password</h1>
          <p className="text-navy-600">Enter your email to reset your password</p>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-soft border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-navy-900">Reset Password</CardTitle>
            <CardDescription className="text-navy-600">
              We'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-navy-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-11 bg-white border-navy-200 focus:border-primary-500 focus:ring-primary-500"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-error-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-error-200 bg-error-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-navy-500">
            © 2024 Sarkar CRM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 