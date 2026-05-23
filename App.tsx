import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Approach } from './components/Approach';
import { Process } from './components/Process';
import { Services } from './components/Services';
import { WhyUs } from './components/WhyUs';
import { ServicesPage } from './components/ServicesPage';
import { AboutView } from './components/AboutView';
import { WhyUsView } from './components/WhyUsView';
import { AIAuditView } from './components/AIAuditView';
import { LegalView } from './components/LegalView';
import { Footer } from './components/Footer';
import ContactModal from './components/ContactModal';
import { Chatbot } from './components/Chatbot';
import { ViewState } from './types';
import { TrustSection } from './components/TrustSection';

const BASE_URL = 'https://buildwithhardik.in';

const VIEW_PATHS: Record<ViewState, string> = {
  home: '/',
  services: '/services',
  about: '/about',
  'why-us': '/why-us',
  'ai-audit': '/ai-audit',
  privacy: '/privacy',
  terms: '/terms',
};

const VIEW_METADATA: Record<
  ViewState,
  {
    pageTitle: string;
    pageDescription: string;
    pageUrl: string;
  }
> = {
  home: {
    pageTitle: 'BuildWithHardik | Web Development, SaaS MVPs & AI Automation',
    pageDescription:
      'BuildWithHardik helps startups and digital businesses launch high-performance websites, scalable SaaS MVPs, and AI automation systems built for growth.',
    pageUrl: VIEW_PATHS.home,
  },
  services: {
    pageTitle: 'Services | Web Development, Management & AI Automation | BuildWithHardik',
    pageDescription:
      'Explore BuildWithHardik services including custom web development, website management, and AI automation solutions for startups and growth-focused brands.',
    pageUrl: VIEW_PATHS.services,
  },
  about: {
    pageTitle: 'About BuildWithHardik | Web Development & AI Product Studio',
    pageDescription:
      'Learn about BuildWithHardik, a performance-first digital product studio focused on scalable web development, SaaS execution, and AI-powered systems.',
    pageUrl: VIEW_PATHS.about,
  },
  'why-us': {
    pageTitle: 'Why BuildWithHardik | Performance-First Web & AI Partner',
    pageDescription:
      'See why founders choose BuildWithHardik for fast websites, scalable SaaS architecture, privacy-conscious engineering, and practical AI automation.',
    pageUrl: VIEW_PATHS['why-us'],
  },
  'ai-audit': {
    pageTitle: 'Free AI Readiness Audit | BuildWithHardik',
    pageDescription:
      'Request a free AI readiness audit from BuildWithHardik to identify automation opportunities, reduce operational friction, and plan practical AI adoption.',
    pageUrl: VIEW_PATHS['ai-audit'],
  },
  privacy: {
    pageTitle: 'Privacy Policy | BuildWithHardik',
    pageDescription:
      'Read the BuildWithHardik privacy policy to understand how we collect, use, and protect data across our web development and AI automation services.',
    pageUrl: VIEW_PATHS.privacy,
  },
  terms: {
    pageTitle: 'Terms & Conditions | BuildWithHardik',
    pageDescription:
      'Review the BuildWithHardik terms and conditions for website projects, AI services, support, payments, delivery, and client responsibilities.',
    pageUrl: VIEW_PATHS.terms,
  },
};

const getViewFromPath = (pathname: string): ViewState => {
  const normalizedPath = pathname === '' ? '/' : pathname.replace(/\/+$/, '') || '/';
  const matchedView = Object.entries(VIEW_PATHS).find(([, path]) => path === normalizedPath);
  return (matchedView?.[0] as ViewState) ?? 'home';
};

const cleanWebsiteContentWrapper = (value: string) =>
  value.replace(/<\/?WebsiteContent_[^>]*>/g, '').trim();

const upsertMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag?.setAttribute(key, value);
  });
};

const updateStructuredData = (view: ViewState, canonicalHref: string) => {
  const metadata = VIEW_METADATA[view];
  const pageName = cleanWebsiteContentWrapper(metadata.pageTitle);
  const pageDescription = cleanWebsiteContentWrapper(metadata.pageDescription);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'BuildWithHardik',
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.png`,
        founder: {
          '@type': 'Person',
          name: 'Hardik Sharma',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Jaipur',
          addressCountry: 'India',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'BuildWithHardik',
        description:
          'BuildWithHardik is a web development and AI automation studio helping startups build scalable digital products.',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalHref}#webpage`,
        url: canonicalHref,
        name: pageName,
        description: pageDescription,
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
    ],
  };

  let scriptTag = document.getElementById('structured-data') as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'structured-data';
    document.head.appendChild(scriptTag);
  }

  scriptTag.textContent = JSON.stringify(structuredData);
};

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>(() =>
    getViewFromPath(window.location.pathname)
  );
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleNavigate = useCallback((view: ViewState) => {
    const nextPath = VIEW_PATHS[view];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ view }, '', nextPath);
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openContact = useCallback(() => setIsContactOpen(true), []);

  useEffect(() => {
    const metadata = VIEW_METADATA[currentView];
    const pageTitle = cleanWebsiteContentWrapper(metadata.pageTitle);
    const pageDescription = cleanWebsiteContentWrapper(metadata.pageDescription);
    const pageUrl = cleanWebsiteContentWrapper(metadata.pageUrl);

    document.title = pageTitle;

    const canonicalHref = `${BASE_URL}${pageUrl === '/' ? '/' : pageUrl}`;
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalHref);
    }

    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute('content', canonicalHref);
    }

    upsertMetaTag('meta[name="description"]', {
      name: 'description',
      content: pageDescription,
    });
    upsertMetaTag('meta[name="robots"]', {
      name: 'robots',
      content: 'index, follow, max-image-preview:large',
    });
    upsertMetaTag('meta[name="googlebot"]', {
      name: 'googlebot',
      content: 'index, follow, max-image-preview:large',
    });
    upsertMetaTag('meta[property="og:title"]', {
      property: 'og:title',
      content: pageTitle,
    });
    upsertMetaTag('meta[property="og:description"]', {
      property: 'og:description',
      content: pageDescription,
    });
    upsertMetaTag('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'BuildWithHardik',
    });
    upsertMetaTag('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    });
    upsertMetaTag('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: pageTitle,
    });
    upsertMetaTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: pageDescription,
    });
    upsertMetaTag('meta[name="twitter:url"]', {
      name: 'twitter:url',
      content: canonicalHref,
    });

    updateStructuredData(currentView, canonicalHref);
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const viewContent = useMemo(() => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <TrustSection />
            <Services />
            <Approach />
            <Process />
            <WhyUs />
          </>
        );
      case 'services':
        return (
          <ServicesPage
            onContact={openContact}
            onNavigate={handleNavigate}
          />
        );
      case 'about':
        return <AboutView />;
      case 'why-us':
        return <WhyUsView />;
      case 'ai-audit':
        return <AIAuditView />;
      case 'privacy':
        return <LegalView type="privacy" />;
      case 'terms':
        return <LegalView type="terms" />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  }, [currentView, handleNavigate, openContact]);

  return (
    <div className="min-h-screen bg-apple-light-bg dark:bg-apple-dark-bg transition-colors duration-300 flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white dark:focus:bg-white dark:focus:text-black"
      >
        Skip to content
      </a>

      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onContactClick={openContact}
      />

      <main id="main-content" className="flex-grow">
        {viewContent}
      </main>

      <Footer onNavigate={handleNavigate} />

      <Chatbot onNavigate={handleNavigate} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default App;
