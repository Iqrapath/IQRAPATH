import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Navigation from '@/components/ui/home/Navigation';
import Hero from '@/components/ui/home/Hero';
import Features from '@/components/ui/home/Features';
import HowItWorks from '@/components/ui/home/HowItWorks';
import Teachers from '@/components/ui/home/Teachers';
import MemorizeQuran from '@/components/ui/home/MemorizeQuran';
import EnrollSection from '@/components/ui/home/EnrollSection';
import Testimonials from '@/components/ui/home/Testimonials';
import BecomeTeacher from '@/components/ui/home/BecomeTeacher';
import FAQ from '@/components/ui/home/FAQ';
import DownloadApp from '@/components/ui/home/DownloadApp';
import CallToAction from '@/components/ui/home/CallToAction';
// import Newsletter from '@/components/ui/home/Newsletter';
import Footer from '@/components/ui/home/Footer';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <Navigation auth={auth} />
                <Hero />
                <Features />
                <HowItWorks />
                <Teachers />
                <MemorizeQuran />
                <EnrollSection />
                <Testimonials />
                <BecomeTeacher />
                <FAQ />
                <DownloadApp />
                <CallToAction />
                {/* <Newsletter /> */}
                <Footer />
        </>
    );
}
