import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AiwasLabs collects, uses, and protects your personal and health data. Compliant with UK GDPR and the Data Protection Act 2018.',
  alternates: { canonical: 'https://aiwaslabs.co.uk/privacy' },
}

const SECTIONS = [
  { id: 'who-we-are',       label: 'Who We Are' },
  { id: 'data-we-collect',  label: 'Data We Collect' },
  { id: 'how-we-use',       label: 'How We Use It' },
  { id: 'legal-basis',      label: 'Legal Basis' },
  { id: 'special-category', label: 'Health Data' },
  { id: 'third-parties',    label: 'Third Parties' },
  { id: 'retention',        label: 'Retention' },
  { id: 'your-rights',      label: 'Your Rights' },
  { id: 'cookies',          label: 'Cookies' },
  { id: 'security',         label: 'Security' },
  { id: 'changes',          label: 'Changes' },
  { id: 'contact',          label: 'Contact Us' },
]

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F6FC]">

        {/* Header */}
        <div className="border-b border-[#dde4f0] bg-[#02034a]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              Legal
            </span>
            <h1 className="mt-3 font-merriweather text-[clamp(28px,4vw,48px)] font-extrabold tracking-[-0.02em] text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 font-poppins text-[13px] text-white/50">
              Last updated: 15 June 2025 · Governed by UK GDPR and the Data Protection Act 2018
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex gap-12 lg:items-start">

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-[220px] flex-shrink-0">
              <div className="sticky top-6 rounded-2xl border border-[#dde4f0] bg-white p-5 shadow-[0_4px_16px_rgba(2,3,74,.06)]">
                <p className="mb-3 font-poppins text-[10px] font-bold uppercase tracking-[0.15em] text-[#9ca3af]">Contents</p>
                <nav className="flex flex-col gap-0.5">
                  {SECTIONS.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded-lg px-3 py-1.5 font-poppins text-[12.5px] text-[#6b7280] transition hover:bg-[#F7F6FC] hover:text-[#02034a]"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-5 border-t border-[#dde4f0] pt-4">
                  <Link href="/terms" className="font-poppins text-[12px] font-semibold text-[#00B4D8] hover:text-[#0077b6] transition">
                    View Terms of Service →
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="rounded-2xl border border-[#dde4f0] bg-white px-8 py-10 shadow-[0_4px_16px_rgba(2,3,74,.06)] lg:px-12">

                <div className="prose-legal">

                  {/* 1 */}
                  <section id="who-we-are">
                    <h2>1. Who We Are</h2>
                    <p>
                      AiwasLabs ("we", "us", "our") is a private blood testing clinic based in Stoke-on-Trent, England. We are the data controller for personal information collected through this website and our clinical services.
                    </p>
                    <p>
                      <strong>Registered address:</strong> Unit 6, Parkhall Business Village, Park Hall Road, Stoke-on-Trent, ST3 5XA<br />
                      <strong>Clinical Director:</strong> Dr. Tanzil (GMC Registered)<br />
                      <strong>Email:</strong> <a href="mailto:Aiwas@aiwasmedical.com">Aiwas@aiwasmedical.com</a><br />
                      <strong>Phone:</strong> 01782 917963
                    </p>
                    <p>
                      We are registered with the Information Commissioner's Office (ICO) as required under UK data protection law.
                    </p>
                  </section>

                  {/* 2 */}
                  <section id="data-we-collect">
                    <h2>2. Data We Collect</h2>

                    <h3>Information you provide directly</h3>
                    <ul>
                      <li><strong>Identity data:</strong> first name, last name, date of birth</li>
                      <li><strong>Contact data:</strong> email address, phone number, postal address</li>
                      <li><strong>Account credentials:</strong> hashed password (we never store passwords in plain text)</li>
                      <li><strong>Health data:</strong> test results, biomarker values, sample dates, and any clinical notes associated with your order - this is special category data under UK GDPR</li>
                      <li><strong>Payment data:</strong> billing address and transaction reference (card details are processed directly by Stripe and never stored on our servers)</li>
                      <li><strong>Booking information:</strong> appointment dates, times, test type, booking type (clinic or home visit)</li>
                      <li><strong>Correspondence:</strong> any messages you send us via email or contact forms</li>
                    </ul>

                    <h3>Information collected automatically</h3>
                    <ul>
                      <li><strong>Usage data:</strong> pages visited, time on site, referring URL, browser type, device type</li>
                      <li><strong>Technical data:</strong> IP address, cookie identifiers, session data</li>
                    </ul>
                  </section>

                  {/* 3 */}
                  <section id="how-we-use">
                    <h2>3. How We Use Your Information</h2>
                    <table>
                      <thead>
                        <tr><th>Purpose</th><th>Data used</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Creating and managing your patient account</td><td>Identity, contact, credentials</td></tr>
                        <tr><td>Processing and fulfilling test bookings</td><td>Identity, contact, booking, health</td></tr>
                        <tr><td>Delivering and processing home test kits</td><td>Identity, contact, delivery address</td></tr>
                        <tr><td>Generating and providing test reports</td><td>Health data, identity</td></tr>
                        <tr><td>Processing payments</td><td>Payment data, identity</td></tr>
                        <tr><td>Sending appointment confirmations and reminders</td><td>Contact, booking</td></tr>
                        <tr><td>Notifying you when results are ready</td><td>Contact, identity</td></tr>
                        <tr><td>Responding to enquiries and support requests</td><td>Identity, contact, correspondence</td></tr>
                        <tr><td>Meeting legal and regulatory obligations</td><td>All categories as required</td></tr>
                        <tr><td>Improving our website and services</td><td>Usage data (anonymised where possible)</td></tr>
                      </tbody>
                    </table>
                    <p>We do not sell your personal data. We do not use your data for automated profiling or decision-making that produces legal or similarly significant effects.</p>
                  </section>

                  {/* 4 */}
                  <section id="legal-basis">
                    <h2>4. Legal Basis for Processing</h2>
                    <p>Under UK GDPR we rely on the following lawful bases:</p>
                    <ul>
                      <li><strong>Contract (Article 6(1)(b)):</strong> processing necessary to fulfil your booking and provide test services</li>
                      <li><strong>Legal obligation (Article 6(1)(c)):</strong> compliance with medical records law, financial reporting, and regulatory requirements</li>
                      <li><strong>Legitimate interests (Article 6(1)(f)):</strong> fraud prevention, IT security, improving our services - where these are not overridden by your rights</li>
                      <li><strong>Consent (Article 6(1)(a)):</strong> marketing communications (where you have opted in), and certain cookies</li>
                    </ul>
                  </section>

                  {/* 5 */}
                  <section id="special-category">
                    <h2>5. Health Data (Special Category)</h2>
                    <p>
                      Your blood test results and related health information are <strong>special category data</strong> under UK GDPR Article 9. We process this data on the basis of:
                    </p>
                    <ul>
                      <li><strong>Article 9(2)(h):</strong> medical diagnosis and provision of health care - the primary basis for processing clinical results</li>
                      <li><strong>Article 9(2)(a):</strong> your explicit consent where required for specific secondary uses</li>
                    </ul>
                    <p>
                      Health data is accessible only to authorised clinical staff (Dr. Tanzil and any designated clinical team members) and to you via your secure patient portal. It is never shared with third parties for marketing, insurance, or employment purposes without your explicit consent.
                    </p>
                  </section>

                  {/* 6 */}
                  <section id="third-parties">
                    <h2>6. Third-Party Processors</h2>
                    <p>We work with carefully selected processors who act on our instructions and are bound by data processing agreements:</p>
                    <table>
                      <thead>
                        <tr><th>Processor</th><th>Purpose</th><th>Location</th></tr>
                      </thead>
                      <tbody>
                        <tr><td><strong>Stripe</strong></td><td>Payment processing</td><td>EU / USA (SCCs)</td></tr>
                        <tr><td><strong>Resend</strong></td><td>Transactional email (confirmations, results)</td><td>USA (SCCs)</td></tr>
                        <tr><td><strong>Neon (Neondatabase)</strong></td><td>Patient database and records storage</td><td>EU</td></tr>
                        <tr><td><strong>Cloudinary</strong></td><td>Product image hosting</td><td>EU / USA (SCCs)</td></tr>
                        <tr><td><strong>UploadThing</strong></td><td>Report file storage</td><td>USA (SCCs)</td></tr>
                        <tr><td><strong>Inuvi</strong></td><td>Home test kit fulfilment</td><td>UK</td></tr>
                        <tr><td><strong>Vercel</strong></td><td>Website hosting and infrastructure</td><td>EU</td></tr>
                      </tbody>
                    </table>
                    <p>
                      Where processors are based outside the UK/EEA, transfers are protected by Standard Contractual Clauses (SCCs) or adequacy decisions under UK GDPR.
                    </p>
                    <p>We do not share your personal data with any other third parties except where required by law (e.g., court order or regulatory authority).</p>
                  </section>

                  {/* 7 */}
                  <section id="retention">
                    <h2>7. How Long We Keep Your Data</h2>
                    <table>
                      <thead>
                        <tr><th>Data type</th><th>Retention period</th><th>Reason</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Clinical / health records</td><td>8 years from last contact</td><td>NHS / MHRA guidance for private providers</td></tr>
                        <tr><td>Financial and payment records</td><td>7 years</td><td>HMRC requirement</td></tr>
                        <tr><td>Account and booking data</td><td>3 years after last activity</td><td>Legitimate interest / legal claims</td></tr>
                        <tr><td>Marketing consent records</td><td>Until consent withdrawn + 1 year</td><td>Regulatory compliance</td></tr>
                        <tr><td>Website analytics</td><td>26 months</td><td>Google Analytics default</td></tr>
                      </tbody>
                    </table>
                    <p>After the applicable period your data is securely deleted or anonymised.</p>
                  </section>

                  {/* 8 */}
                  <section id="your-rights">
                    <h2>8. Your Rights</h2>
                    <p>Under UK GDPR you have the following rights:</p>
                    <ul>
                      <li><strong>Right of access:</strong> request a copy of the personal data we hold about you</li>
                      <li><strong>Right to rectification:</strong> ask us to correct inaccurate or incomplete data</li>
                      <li><strong>Right to erasure:</strong> request deletion of your data where there is no compelling reason to continue processing</li>
                      <li><strong>Right to restrict processing:</strong> ask us to pause processing while accuracy or lawfulness is contested</li>
                      <li><strong>Right to data portability:</strong> receive your data in a structured, machine-readable format</li>
                      <li><strong>Right to object:</strong> object to processing based on legitimate interests or for direct marketing</li>
                      <li><strong>Rights related to automated decisions:</strong> not to be subject to solely automated decisions with significant effects</li>
                      <li><strong>Right to withdraw consent:</strong> where processing is based on consent, you can withdraw it at any time without affecting the lawfulness of prior processing</li>
                    </ul>
                    <p>
                      To exercise any of these rights, email us at <a href="mailto:Aiwas@aiwasmedical.com">Aiwas@aiwasmedical.com</a>. We will respond within <strong>30 days</strong>. We may need to verify your identity before processing certain requests.
                    </p>
                    <p>
                      You also have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a> or by calling 0303 123 1113.
                    </p>
                  </section>

                  {/* 9 */}
                  <section id="cookies">
                    <h2>9. Cookies</h2>
                    <p>We use the following cookies:</p>
                    <table>
                      <thead>
                        <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
                      </thead>
                      <tbody>
                        <tr><td><code>patient_token</code></td><td>Keeps you signed in to your patient account (httpOnly, secure)</td><td>7 days</td></tr>
                        <tr><td><code>cart</code></td><td>Stores home kit items in your basket</td><td>Session</td></tr>
                        <tr><td>Analytics cookies</td><td>Anonymous usage data to improve the site</td><td>Up to 26 months</td></tr>
                      </tbody>
                    </table>
                    <p>Essential cookies (patient_token, cart) are necessary for the site to function and do not require consent. Analytics cookies are only set after you accept via our cookie notice.</p>
                  </section>

                  {/* 10 */}
                  <section id="security">
                    <h2>10. Security</h2>
                    <p>We protect your data using:</p>
                    <ul>
                      <li>TLS/HTTPS encryption for all data in transit</li>
                      <li>Bcrypt password hashing (cost factor 12)</li>
                      <li>httpOnly, SameSite session cookies</li>
                      <li>Role-based access control - clinical data is only accessible to authorised staff</li>
                      <li>Encrypted database connections (Neon PostgreSQL with SSL)</li>
                    </ul>
                    <p>In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify the ICO within 72 hours and inform affected individuals without undue delay.</p>
                  </section>

                  {/* 11 */}
                  <section id="changes">
                    <h2>11. Changes to This Policy</h2>
                    <p>
                      We may update this Privacy Policy from time to time. When we make material changes we will update the "Last updated" date at the top of this page and, where appropriate, notify you by email. We encourage you to review this page periodically.
                    </p>
                  </section>

                  {/* 12 */}
                  <section id="contact">
                    <h2>12. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
                    <ul>
                      <li><strong>Email:</strong> <a href="mailto:Aiwas@aiwasmedical.com">Aiwas@aiwasmedical.com</a></li>
                      <li><strong>Phone:</strong> 01782 917963</li>
                      <li><strong>Post:</strong> AiwasLabs, Unit 6, Parkhall Business Village, Park Hall Road, Stoke-on-Trent, ST3 5XA</li>
                    </ul>
                  </section>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .prose-legal section { margin-bottom: 2.5rem; }
        .prose-legal h2 {
          font-family: var(--font-merriweather, serif);
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 800;
          color: #02034a;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #CAF0F8;
        }
        .prose-legal h3 {
          font-family: var(--font-poppins, sans-serif);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #02034a;
          margin: 1.25rem 0 0.5rem;
        }
        .prose-legal p {
          font-family: var(--font-poppins, sans-serif);
          font-size: 14px;
          line-height: 1.8;
          color: #374151;
          margin-bottom: 0.85rem;
        }
        .prose-legal ul {
          margin: 0.5rem 0 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .prose-legal li {
          font-family: var(--font-poppins, sans-serif);
          font-size: 14px;
          line-height: 1.7;
          color: #374151;
          list-style: disc;
        }
        .prose-legal a { color: #00B4D8; text-decoration: underline; }
        .prose-legal a:hover { color: #0077b6; }
        .prose-legal strong { color: #02034a; font-weight: 600; }
        .prose-legal code {
          font-family: monospace;
          font-size: 12px;
          background: #F7F6FC;
          border: 1px solid #dde4f0;
          border-radius: 4px;
          padding: 1px 6px;
          color: #02034a;
        }
        .prose-legal table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.25rem;
          font-family: var(--font-poppins, sans-serif);
          font-size: 13px;
        }
        .prose-legal th {
          background: #02034a;
          color: #fff;
          font-weight: 600;
          padding: 9px 14px;
          text-align: left;
        }
        .prose-legal td {
          padding: 9px 14px;
          color: #374151;
          border-bottom: 1px solid #dde4f0;
          vertical-align: top;
        }
        .prose-legal tr:nth-child(even) td { background: #F7F6FC; }
      `}</style>
    </>
  )
}
