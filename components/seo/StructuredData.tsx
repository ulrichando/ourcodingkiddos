export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Our Coding Kiddos",
    "description": "Interactive online coding classes for kids aged 7-18. Learn HTML, CSS, JavaScript, Python, and Roblox programming.",
    "url": "https://ourcodingkiddos.com",
    "logo": "https://ourcodingkiddos.com/icon.svg",
    "sameAs": [
      // Add your social media links here
      "https://facebook.com/ourcodingkiddos",
      "https://twitter.com/codingkiddos",
      "https://instagram.com/ourcodingkiddos"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@ourcodingkiddos.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Our Coding Kiddos",
    "url": "https://ourcodingkiddos.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ourcodingkiddos.com/courses?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Coding Classes for Kids",
    "description": "Comprehensive coding education for children aged 7-18",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Our Coding Kiddos",
      "url": "https://ourcodingkiddos.com"
    },
    "educationalLevel": "Beginner to Advanced",
    "courseMode": "Online",
    "availableLanguage": "English",
    "teaches": [
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Roblox Programming"
    ],
    "audienceType": "Children aged 7-18",
    "hasCourseInstance": [
      {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": "PT1H",
        "instructor": {
          "@type": "Person",
          "name": "Professional Coding Instructor"
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ourcodingkiddos.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": "https://ourcodingkiddos.com/courses"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}
