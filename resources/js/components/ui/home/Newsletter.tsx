import React from 'react';

export default function Newsletter() {
  return (
    <section className="py-16 bg-[#F3E5C3] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#2F8D8C] opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#2F8D8C] opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Stay Updated with IqraPath
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about new courses, teaching techniques,
            and special offers directly to your inbox.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-4 text-base text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F8D8C] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex-none bg-[#2F8D8C] px-6 py-4 text-base font-medium text-white rounded-full hover:bg-[#267373] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F8D8C]"
            >
              Subscribe
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
