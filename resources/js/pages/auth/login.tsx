import { Head, useForm } from '@inertiajs/react';
import { Eye, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthSplitLayout>
            <Head title="Login your Account" />

            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-400 dark:text-white mb-1 flex items-center">
                    <span className="mr-2">👋</span> Welcome! Start Learning Today
                </h1>
                <p className="text-sm text-gray-500">Login your account to browse teachers, book sessions, and start learning with ease.</p>
            </div>

            <form className="flex flex-col w-full space-y-4" onSubmit={submit}>
                <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="youremail@gmail.com"
                        className="mt-1 rounded-md border-gray-200 h-10"
                    />
                    <InputError message={errors.email} className="text-xs mt-1" />
                </div>

                <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative mt-1">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="rounded-md border-gray-200 h-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    </div>
                    <InputError message={errors.password} className="text-xs mt-1" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="rounded border-gray-300 text-[#2B6B65]"
                        />
                        <Label htmlFor="remember" className="text-xs text-gray-600">Remember me</Label>
                    </div>

                    {canResetPassword && (
                        <TextLink href={route('password.request')} className="text-xs text-red-500 font-normal" tabIndex={5}>
                            Forgot Password
                        </TextLink>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-[#2B6B65] hover:bg-[#235652] text-white"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
                    Login your Account
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-4 text-gray-500">Or Login With</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <button
                        type="button"
                        className="flex items-center justify-center w-full h-10 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                    >
                        <div className="mr-2 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.4668 9.20455C17.4668 8.56136 17.4141 7.97727 17.3086 7.41818H9.07031V10.5984H13.8164C13.625 11.6348 13.043 12.4634 12.1406 13.0365V15.0693H14.918C16.5117 13.6364 17.4668 11.6348 17.4668 9.20455Z" fill="#4285F4"/>
                                <path d="M9.07031 17.7273C11.3945 17.7273 13.3574 16.9693 14.9219 15.0693L12.1445 13.0364C11.3926 13.5545 10.3828 13.875 9.07422 13.875C6.83203 13.875 4.94922 12.3966 4.23047 10.3977H1.37109V12.4966C2.92969 15.6136 5.80469 17.7273 9.07031 17.7273Z" fill="#34A853"/>
                                <path d="M4.22656 10.3977C4.05469 9.87955 3.96094 9.33045 3.96094 8.76136C3.96094 8.19227 4.05859 7.64318 4.22656 7.125V5.02614H1.36719C0.837891 6.125 0.535156 7.3807 0.535156 8.76136C0.535156 10.142 0.837891 11.3977 1.36719 12.4966L4.22656 10.3977Z" fill="#FBBC05"/>
                                <path d="M9.07031 3.64773C10.3633 3.64773 11.5156 4.08523 12.4297 4.94318L14.8945 2.47727C13.3555 1.04545 11.3926 0.22727 9.07031 0.22727C5.80469 0.22727 2.92969 2.34091 1.37109 5.45795L4.23047 7.55682C4.94922 5.55795 6.83203 3.64773 9.07031 3.64773Z" fill="#EA4335"/>
                            </svg>
                        </div>
                        Continue with Google
                    </button>

                    <button
                        type="button"
                        className="flex items-center justify-center w-full h-10 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 text-blue-600" aria-hidden="true">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"
                            fill="#1877F2"/>
                        </svg>
                        Continue with Facebook
                    </button>
                </div>

                <div className="text-center text-xs text-gray-600">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} className="text-[#2B6B65] font-medium" tabIndex={5}>
                        Sign Up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mt-3 text-center text-xs font-medium text-green-600">{status}</div>}
        </AuthSplitLayout>
    );
}