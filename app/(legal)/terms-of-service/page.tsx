import { Metadata } from "next";
import { PlaceholderNotice } from "@/components/legal/PlaceholderNotice";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: "Placeholder — describe what it means for a user to accept these terms by using Arvi, and who may use the service.",
  },
  {
    title: "Your Account",
    body: "Placeholder — describe account creation, eligibility, and user responsibilities for account security.",
  },
  {
    title: "User Content",
    body: "Placeholder — describe ownership and licensing of posts, listings, photos, and other content users submit, plus prohibited content.",
  },
  {
    title: "Marketplace & Listings",
    body: "Placeholder — describe rules around creating listings, transactions between users, and Arvi's role (or lack thereof) in disputes.",
  },
  {
    title: "Prohibited Conduct",
    body: "Placeholder — describe conduct not allowed on the platform (harassment, fraud, spam, scraping, etc.) and consequences.",
  },
  {
    title: "Termination",
    body: "Placeholder — describe conditions under which accounts may be suspended or terminated, by either party.",
  },
  {
    title: "Disclaimers & Limitation of Liability",
    body: "Placeholder — describe warranty disclaimers and limitations of Arvi's liability to the extent permitted by law.",
  },
  {
    title: "Changes to These Terms",
    body: "Placeholder — describe how and when these terms may be updated and how users will be notified.",
  },
  {
    title: "Contact Us",
    body: "Placeholder — provide a contact channel for questions about these terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-accent">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        Terms of Service
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
