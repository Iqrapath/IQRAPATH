import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import axios from 'axios';

export default function TestApiClient() {
    const { auth } = usePage<PageProps>().props;
    const [token, setToken] = useState<string>('');
    const [apiResult, setApiResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to get a Sanctum token
    const getToken = async () => {
        try {
            setLoading(true);
            // Get CSRF token first
            await axios.get('/sanctum/csrf-cookie');
            
            // Login to get token
            const response = await axios.post('/login', {
                email: auth.user.email,
                password: 'your-password-here' // You'll need to replace this
            });
            
            // The token should now be in the cookies
            setToken('Token set in cookies');
            setLoading(false);
        } catch (err: any) {
            setError('Error getting token: ' + err.message);
            setLoading(false);
        }
    };

    // Function to test the API
    const testApi = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/student/stats', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setApiResult(response.data);
            setLoading(false);
        } catch (err: any) {
            setError('API Error: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title="API Test Client" />
            
            <h1 className="text-2xl font-bold mb-4">API Test Client</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Authentication</h2>
                
                {token ? (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {token}
                    </div>
                ) : (
                    <button 
                        onClick={getToken}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Getting token...' : 'Get Token'}
                    </button>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Test API Endpoint</h2>
                
                <button 
                    onClick={testApi}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 mb-4"
                >
                    {loading ? 'Fetching data...' : 'Test Stats API'}
                </button>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                        {error}
                    </div>
                )}
                
                {apiResult && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">API Response:</h3>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(apiResult, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
} 