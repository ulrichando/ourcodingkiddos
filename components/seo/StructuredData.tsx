export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Our Coding Kiddos",
    "alternateName": "Coding Kiddos",
    "description": "Top-rated online coding classes for kids ages 7-18. Learn JavaScript, Python, HTML, CSS, and game development with live instructors.",
    "url": "https://ourcodingkiddos.com",
    "logo": "https://ourcodingkiddos.com/icon.svg",
    "image": "https://ourcodingkiddos.com/opengraph-image",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578690800757"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@ourcodingkiddos.com",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "priceRange": "$$"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Our Coding Kiddos",
    "alternateName": "Coding Kiddos",
    "url": "https://ourcodingkiddos.com",
    "description": "Online coding classes for kids ages 7-18",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ourcodingkiddos.com/courses?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // JavaScript Game Development Course
  const jsCourseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "JavaScript Game Development for Kids",
    "description": "Learn to build interactive games using JavaScript. Perfect for kids who love gaming and want to create their own games!",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Our Coding Kiddos",
      "url": "https://ourcodingkiddos.com"
    },
    "educationalLevel": "Beginner to Intermediate",
    "courseMode": "Online",
    "availableLanguage": "English",
    "teaches": ["JavaScript", "Game Development", "HTML5 Canvas", "Programming Logic"],
    "audienceType": "Children aged 7-18",
    "timeRequired": "PT2H",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseSchedule": {
        "@type": "Schedule",
        "byDay": "Saturday",
        "startTime": "09:00",
        "endTime": "11:00",
        "repeatFrequency": "Weekly"
      }
    }
  };

  // Intro to Programming Course
  const introCourseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Introduction to Programming for Kids",
    "description": "Start your coding journey with the fundamentals. Great for beginners who are new to programming!",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Our Coding Kiddos",
      "url": "https://ourcodingkiddos.com"
    },
    "educationalLevel": "Beginner",
    "courseMode": "Online",
    "availableLanguage": "English",
    "teaches": ["Programming Basics", "Problem Solving", "Computational Thinking", "HTML", "CSS"],
    "audienceType": "Children aged 7-18",
    "timeRequired": "PT2H",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseSchedule": {
        "@type": "Schedule",
        "byDay": "Sunday",
        "startTime": "09:00",
        "endTime": "11:00",
        "repeatFrequency": "Weekly"
      }
    }
  };

  // FAQ Schema for rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What age groups do you teach?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We teach coding to kids ages 7-18. Our programs are designed with age-appropriate content and teaching methods for different skill levels."
        }
      },
      {
        "@type": "Question",
        "name": "What programming languages do you teach?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We teach JavaScript, Python, HTML, CSS, and Roblox programming. Our curriculum covers game development, web development, and computational thinking."
        }
      },
      {
        "@type": "Question",
        "name": "Are the classes live or pre-recorded?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our classes are live with real instructors. We offer group classes on Saturdays and Sundays, as well as 1-on-1 private sessions."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need any prior coding experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No prior experience needed! We have beginner-friendly courses designed for kids who are completely new to coding."
        }
      }
    ]
  };

  // Local Business Schema for better local SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Our Coding Kiddos",
    "@id": "https://ourcodingkiddos.com",
    "url": "https://ourcodingkiddos.com",
    "image": "https://ourcodingkiddos.com/opengraph-image",
    "description": "Online coding classes for kids ages 7-18",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "11:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "11:00"
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
          __html: JSON.stringify(jsCourseSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(introCourseSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
    </>
  );
}
