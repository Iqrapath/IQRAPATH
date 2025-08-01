import { Link } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useState } from 'react';

interface NavigationProps {
  auth?: SharedData['auth'];
}

export default function Navigation({ auth }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-[#FFF9E9] py-4 shadow-sm z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <img
                  src="/Logo.png"
                  alt="IqraPath"
                  className="h-8 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Desktop navigation - hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            <div className="flex md:space-x-2 lg:space-x-8">
              <Link
                href="/"
                className="text-[#2F8D8C] border-b-2 border-[#2F8D8C] px-2 lg:px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                Home
              </Link>
              <Link
                href="/find-teacher"
                className="text-gray-600 hover:text-[#2F8D8C] hover:border-b-2 hover:border-[#2F8D8C] px-2 lg:px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                Find a Teacher
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-[#2F8D8C] hover:border-b-2 hover:border-[#2F8D8C] px-2 lg:px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                How It Works
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-[#2F8D8C] hover:border-b-2 hover:border-[#2F8D8C] px-2 lg:px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-[#2F8D8C] hover:border-b-2 hover:border-[#2F8D8C] px-2 lg:px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Desktop authentication buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {auth?.user ? (
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-[#2F8D8C] px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-[#2F8D8C] hover:bg-[#267373] text-white rounded-full px-4 lg:px-5 py-2 text-sm font-medium whitespace-nowrap"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="border border-[#2F8D8C] hover:border-[#2F8D8C] hover:text-[#2F8D8C] text-gray-600 rounded-full px-4 lg:px-5 py-2 text-sm whitespace-nowrap"
                >
                  sign in
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#2F8D8C] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF9E9] shadow-lg absolute left-0 right-0 top-full z-40 border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-[#2F8D8C] block px-3 py-2 text-base font-medium border-l-4 border-[#2F8D8C]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/find-teacher"
              className="text-gray-600 hover:text-[#2F8D8C] block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-[#2F8D8C]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Teacher
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-600 hover:text-[#2F8D8C] block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-[#2F8D8C]"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-[#2F8D8C] block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-[#2F8D8C]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#2F8D8C] block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-[#2F8D8C]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 px-4">
              {auth?.user ? (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-[#2F8D8C] px-3 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-[#2F8D8C] hover:bg-[#267373] text-white rounded-full px-5 py-2 text-base font-medium w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="border border-[#2F8D8C] hover:border-[#2F8D8C] hover:text-[#2F8D8C] text-gray-600 rounded-full px-5 py-2 text-base w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
