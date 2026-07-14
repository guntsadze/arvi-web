import { Metadata } from "next";
import { PlaceholderNotice } from "@/components/legal/PlaceholderNotice";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "Information We Collect",
    body: "Placeholder — describe the categories of data Arvi collects (account details, profile content, car and listing data, device/usage data, cookies, etc.) and how each is gathered.",
  },
  {
    title: "How We Use Your Data",
    body: "Placeholder — describe the purposes data is used for (operating the service, personalization, communications, safety and fraud prevention, analytics, legal compliance).",
  },
  {
    title: "How We Share Your Data",
    body: "Placeholder — describe any sharing with service providers, other users (e.g. public profile/listing content), or legal authorities, and under what conditions.",
  },
  {
    title: "Data Retention",
    body: "Placeholder — describe how long data is kept and the criteria used to determine retention periods.",
  },
  {
    title: "Your Rights",
    body: "Placeholder — describe user rights (access, correction, deletion, portability, objection) and how to exercise them.",
  },
  {
    title: "Cookies & Tracking",
    body: "Placeholder — describe cookie usage, analytics tools, and how users can manage preferences.",
  },
  {
    title: "Security",
    body: "Placeholder — describe the safeguards in place to protect user data.",
  },
  {
    title: "Changes to This Policy",
    body: "Placeholder — describe how and when this policy may be updated and how users will be notified.",
  },
  {
    title: "Contact Us",
    body: "Placeholder — provide a contact channel for privacy-related questions or requests.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-accent">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-text-secondary">
        Last updated: placeholder date
      </p>

      <div className="mt-8">
        <PlaceholderNotice />
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
