import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'AiwasLabs terms of service covering bookings, cancellations, home kits, medical disclaimers, and patient responsibilities. Governed by the laws of England and Wales.',
  alternates: { canonical: 'https://aiwaslabs.co.uk/terms' },
}

const SECTIONS = [
  { id: 'introduction',      label: 'Introduction' },
  { id: 'services',          label: 'Our Services' },
  { id: 'eligibility',       label: 'Eligibility' },
  { id: 'booking',           label: 'Booking & Cancellation' },
  { id: 'payment',           label: 'Payment & Refunds' },
  { id: 'home-kits',         label: 'Home Test Kits' },
  { id: 'results',           label: 'Test Results' },
  { id: 'medical',           label: 'Medical Disclaimer' },
  { id: 'conduct',           label: 'Patient Conduct' },
  { id: 'liability',         label: 'Liability' },
  { id: 'intellectual',      label: 'Intellectual Property' },
  { id: 'governing-law',     label: 'Governing Law' },
  { id: 'changes',           label: 'Changes' },
  { id: 'contact',           label: 'Contact Us' },
]

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="mt-2 font-poppins text-[13px] text-white/50">
              Last updated: 15 June 2025 · Governed by the laws of England and Wales
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
                  <Link href="/privacy" className="font-poppins text-[12px] font-semibold text-[#00B4D8] hover:text-[#0077b6] transition">
                    View Privacy Policy →
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="rounded-2xl border border-[#dde4f0] bg-white px-8 py-10 shadow-[0_4px_16px_rgba(2,3,74,.06)] lg:px-12">

                <div className="prose-legal">

                  {/* 1 */}
                  <section id="introduction">
                    <h2>1. Introduction</h2>
                    <p>
                      These Terms of Service ("Terms") govern your use of the AiwasLabs website at <strong>aiwaslabs.co.uk</strong> and the clinical services we provide. By booking a test, creating an account, or placing an order with us you agree to be bound by these Terms. Please read them carefully.
                    </p>
                    <p>
                      AiwasLabs is operated by <strong>Aiwas Medical Ltd</strong>, a company registered in England and Wales. Our registered office is Unit 6, Parkhall Business Village, Park Hall Road, Stoke-on-Trent, ST3 5XA.
                    </p>
                  </section>

                  {/* 2 */}
                  <section id="services">
                    <h2>2. Our Services</h2>
                    <p>AiwasLabs provides the following private healthcare services:</p>
                    <ul>
                      <li><strong>Clinic blood tests:</strong> appointment-based blood draws carried out at our Stoke-on-Trent premises by trained clinical staff, with results reviewed by Dr. Tanzil</li>
                      <li><strong>Home visit tests:</strong> a clinical practitioner visits your home to take a blood sample at your arranged time</li>
                      <li><strong>Home test kits (Inuvi):</strong> self-collection kits dispatched to your address; a trained examiner attends to assist with the sample, which is then sent to an accredited laboratory</li>
                    </ul>
                    <p>
                      All test results are reviewed by a GMC-registered physician before being released to you. We reserve the right to withdraw or modify services at any time with reasonable notice.
                    </p>
                  </section>

                  {/* 3 */}
                  <section id="eligibility">
                    <h2>3. Eligibility</h2>
                    <ul>
                      <li>You must be at least <strong>18 years of age</strong> to book and pay for services. Patients aged 16–17 may access services with verified written consent from a parent or legal guardian.</li>
                      <li>You must provide accurate and complete information when creating an account or making a booking. Providing false information may result in account termination.</li>
                      <li>You must be physically present in the United Kingdom to receive our services.</li>
                      <li>You warrant that you are not aware of any condition that would make the blood draw clinically inadvisable without consulting your GP first. If in doubt, please seek GP advice before booking.</li>
                    </ul>
                  </section>

                  {/* 4 */}
                  <section id="booking">
                    <h2>4. Booking & Cancellation</h2>

                    <h3>Making a booking</h3>
                    <p>
                      Bookings are confirmed once you receive an email confirmation from us. We reserve the right to refuse or cancel any booking at our discretion, in which case a full refund will be issued.
                    </p>

                    <h3>Cancellation by you</h3>
                    <ul>
                      <li><strong>More than 24 hours before your appointment:</strong> full refund, no charge</li>
                      <li><strong>Less than 24 hours before your appointment:</strong> a cancellation fee of up to 50% of the booking value may apply</li>
                      <li><strong>No-show (failure to attend without notice):</strong> no refund will be issued</li>
                    </ul>
                    <p>To cancel, contact us at <a href="mailto:Aiwas@aiwasmedical.com">Aiwas@aiwasmedical.com</a> or call 01782 917963.</p>

                    <h3>Cancellation by us</h3>
                    <p>
                      In exceptional circumstances (e.g., clinical emergency, staff illness) we may need to reschedule your appointment. We will contact you as soon as possible and offer an alternative time or a full refund.
                    </p>

                    <h3>Rescheduling</h3>
                    <p>You may reschedule your appointment free of charge provided you give at least 24 hours notice. Rescheduling within 24 hours of your appointment may incur a fee.</p>
                  </section>

                  {/* 5 */}
                  <section id="payment">
                    <h2>5. Payment & Refunds</h2>
                    <p>
                      All prices are displayed in GBP and include VAT where applicable. Payment is taken at the time of booking via our secure payment processor, Stripe. We accept all major debit and credit cards.
                    </p>
                    <p>
                      Refunds are processed to the original payment method within <strong>5–10 working days</strong> of approval. We are not liable for delays caused by your bank or card issuer.
                    </p>
                    <p>
                      If you believe a charge was made in error, please contact us within 30 days of the transaction date.
                    </p>
                  </section>

                  {/* 6 */}
                  <section id="home-kits">
                    <h2>6. Home Test Kits</h2>
                    <p>
                      Home test kits are fulfilled by our partner Inuvi. By ordering a home kit you agree to Inuvi's additional service terms as communicated at the point of purchase.
                    </p>
                    <ul>
                      <li>Kits are dispatched within 1–2 working days of order confirmation</li>
                      <li>You are responsible for ensuring someone is available to receive the kit and assist with sample collection at the agreed time</li>
                      <li>Samples must be returned within the specified timeframe indicated in the kit instructions. Samples received outside this window may be rejected and a replacement kit offered at cost</li>
                      <li>Home kits are non-refundable once dispatched, except where the kit is defective or lost in transit</li>
                    </ul>
                  </section>

                  {/* 7 */}
                  <section id="results">
                    <h2>7. Test Results</h2>
                    <ul>
                      <li>Results are typically available the <strong>same day</strong> for clinic visits, and within <strong>2–5 working days</strong> for home kits, depending on the test panel</li>
                      <li>Results are made available through your secure patient portal at <strong>aiwaslabs.co.uk/account</strong></li>
                      <li>You will receive an email notification when your results are ready. It is your responsibility to check your email and portal</li>
                      <li>Results are reviewed by Dr. Tanzil before release. In the rare event that results require urgent clinical attention, we will contact you directly by phone</li>
                      <li>We retain your results for the period set out in our Privacy Policy and you may request a copy at any time</li>
                    </ul>
                  </section>

                  {/* 8 */}
                  <section id="medical">
                    <h2>8. Medical Disclaimer</h2>
                    <p className="font-semibold text-[#02034a]">
                      AiwasLabs provides private diagnostic testing services. We are not a substitute for your NHS GP or any other primary or secondary healthcare provider.
                    </p>
                    <ul>
                      <li>Our services are diagnostic only. We do not prescribe medication or provide ongoing medical treatment</li>
                      <li>Test results should be interpreted in the context of your full medical history. We recommend discussing any results with your GP, especially if results fall outside the reference range</li>
                      <li>If you are experiencing a medical emergency, call <strong>999</strong> immediately. Do not rely on this service in an emergency</li>
                      <li>Normal results do not guarantee the absence of disease. Abnormal results do not necessarily confirm a diagnosis. Always seek professional clinical advice</li>
                      <li>We are not liable for any harm arising from a failure to seek or follow appropriate medical advice</li>
                    </ul>
                  </section>

                  {/* 9 */}
                  <section id="conduct">
                    <h2>9. Patient Conduct</h2>
                    <p>You agree not to:</p>
                    <ul>
                      <li>Provide false or misleading personal or medical information</li>
                      <li>Attend an appointment under the influence of alcohol or controlled substances</li>
                      <li>Behave in an abusive, threatening, or violent manner toward any member of our team</li>
                      <li>Share your patient portal account credentials with any other person</li>
                      <li>Attempt to access another patient's records or interfere with our systems</li>
                    </ul>
                    <p>
                      Breach of this clause may result in immediate termination of your account and refusal of future services. We reserve the right to involve law enforcement where conduct is criminal.
                    </p>
                  </section>

                  {/* 10 */}
                  <section id="liability">
                    <h2>10. Limitation of Liability</h2>
                    <p>
                      To the fullest extent permitted by law:
                    </p>
                    <ul>
                      <li>Our total liability to you for any claim arising from or in connection with these Terms or our services shall not exceed the amount you paid us for the specific service giving rise to the claim</li>
                      <li>We are not liable for any indirect, consequential, or special losses, including loss of profits, loss of data, or loss of opportunity</li>
                      <li>Nothing in these Terms limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law</li>
                    </ul>
                    <p>
                      Our clinical staff exercise reasonable professional skill and care. However, medical testing involves inherent uncertainty and we cannot guarantee that every condition will be detected by the tests you purchase.
                    </p>
                  </section>

                  {/* 11 */}
                  <section id="intellectual">
                    <h2>11. Intellectual Property</h2>
                    <p>
                      All content on this website - including text, images, logos, design, and code - is owned by or licensed to AiwasLabs and is protected by copyright, trade mark, and other intellectual property rights.
                    </p>
                    <p>
                      You may view and print content for personal, non-commercial use only. You must not reproduce, distribute, modify, or create derivative works without our prior written consent.
                    </p>
                    <p>
                      Your test results and associated health data remain your personal data as defined under UK GDPR. See our <Link href="/privacy">Privacy Policy</Link> for full details.
                    </p>
                  </section>

                  {/* 12 */}
                  <section id="governing-law">
                    <h2>12. Governing Law</h2>
                    <p>
                      These Terms and any dispute or claim arising from them shall be governed by the laws of <strong>England and Wales</strong>. You and AiwasLabs both submit to the exclusive jurisdiction of the courts of England and Wales.
                    </p>
                    <p>
                      If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
                    </p>
                  </section>

                  {/* 13 */}
                  <section id="changes">
                    <h2>13. Changes to These Terms</h2>
                    <p>
                      We may update these Terms from time to time. Changes will be posted on this page with an updated date. Your continued use of our services after changes are posted constitutes your acceptance of the revised Terms. For material changes we will notify registered patients by email.
                    </p>
                  </section>

                  {/* 14 */}
                  <section id="contact">
                    <h2>14. Contact Us</h2>
                    <p>If you have questions about these Terms, please get in touch:</p>
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
