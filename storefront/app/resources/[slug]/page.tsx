import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ARTICLES, AUTHOR, getArticle, formatDate } from '@/lib/articles'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}

  const pageUrl = `https://aiwaslabs.co.uk/resources/${slug}`

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      authors: [AUTHOR.name],
      tags: [article.biomarker, article.category, 'blood test', 'health'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = ARTICLES.filter(a => a.slug !== article.slug && a.category === article.category).slice(0, 3)
  const others  = related.length < 3
    ? [...related, ...ARTICLES.filter(a => a.slug !== article.slug && a.category !== article.category).slice(0, 3 - related.length)]
    : related

  const pageUrl = `https://aiwaslabs.co.uk/resources/${slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: article.title,
    description: article.excerpt,
    url: pageUrl,
    datePublished: article.date,
    author: { '@type': 'Person', name: AUTHOR.name, jobTitle: AUTHOR.role },
    publisher: { '@type': 'Organization', name: 'AiwasLabs', url: 'https://aiwaslabs.co.uk' },
    about: { '@type': 'MedicalCondition', name: article.biomarker },
    medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiwaslabs.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://aiwaslabs.co.uk/resources' },
      { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Hero */}
      <section
        className="pb-12 pt-28 lg:pb-16 lg:pt-36"
        style={{ background: `linear-gradient(135deg, ${article.accent}ee 0%, ${article.accent} 100%)` }}
      >
        <div className="mx-auto max-w-[800px] px-5">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/resources"
              className="flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-white/70 transition hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Resources
            </Link>
            <span className="font-poppins text-[12px] text-white/40">/</span>
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 font-poppins text-[11px] font-semibold text-white">
              {article.category}
            </span>
          </div>

          <h1 className="mt-5 font-merriweather text-[28px] font-extrabold leading-snug text-white lg:text-[40px]">
            {article.title}
          </h1>
          <p className="mt-3 font-poppins text-[14px] leading-relaxed text-white/75">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30 bg-white/20">
                <span className="font-merriweather text-[11px] font-extrabold text-white">Dr</span>
              </div>
              <div>
                <p className="font-poppins text-[12px] font-semibold text-white">{AUTHOR.name}</p>
                <p className="font-poppins text-[10px] text-white/60">{AUTHOR.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 font-poppins text-[12px] text-white/60">
              <span>{formatDate(article.date)}</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#F7F6FC]">
        <div className="mx-auto max-w-[800px] px-5 py-12 lg:py-16">

          {/* Article body */}
          <article
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* References */}
          {article.references.length > 0 && (
            <div className="mt-12 rounded-2xl border border-[#dde4f0] bg-white p-6 lg:p-8">
              <h2 className="mb-5 font-merriweather text-[18px] font-extrabold text-[#02034a]">References</h2>
              <ol className="list-decimal space-y-3 pl-5">
                {article.references.map((ref, i) => (
                  <li key={i} className="font-poppins text-[12px] leading-relaxed text-[#6b7280]">
                    <span dangerouslySetInnerHTML={{ __html: ref.citation.replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Medical disclaimer */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-poppins text-[12px] leading-relaxed text-amber-700">
              <strong>Medical disclaimer:</strong> This article is for educational purposes only and does not constitute medical advice. It is not a substitute for professional clinical assessment. If you have concerns about your health, consult a qualified healthcare professional.
            </p>
          </div>

          {/* Book CTA */}
          {article.relatedProduct && (
            <div className="mt-8 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#011B50_0%,#02034a_60%,#010238_100%)] p-6 lg:p-8">
              <p className="font-poppins text-[11px] font-semibold uppercase tracking-[.12em] text-[#00B4D8]">
                Ready to check your {article.biomarker}?
              </p>
              <h3 className="mt-2 font-merriweather text-[20px] font-extrabold text-white lg:text-[24px]">
                Get tested today - same-day results.
              </h3>
              <p className="mt-2 font-poppins text-[13px] leading-relaxed text-white/65">
                Our clinic in Stoke-on-Trent offers fast, accurate blood testing reviewed by Dr. Tanzil, with results returned the same day.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#00B4D8] px-5 py-2.5 font-poppins text-[13px] font-bold text-white transition hover:bg-[#0096b8]"
              >
                View Tests
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          )}

          {/* Related articles */}
          {others.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 font-merriweather text-[22px] font-extrabold text-[#02034a]">
                More from our resources
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {others.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/resources/${rel.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#dde4f0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className="flex h-[72px] items-end p-4"
                      style={{ background: `linear-gradient(135deg, ${rel.accent}cc, ${rel.accent})` }}
                    >
                      <p className="font-poppins text-[10px] font-bold uppercase tracking-widest text-white/80">
                        {rel.biomarker}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-merriweather text-[13px] font-extrabold leading-snug text-[#02034a] group-hover:text-[#0077b6] transition line-clamp-2">
                        {rel.title}
                      </h3>
                      <p className="mt-auto pt-3 font-poppins text-[11px] text-[#9ca3af]">
                        {formatDate(rel.date)} · {rel.readTime} min
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .prose-article {
          font-family: var(--font-poppins, sans-serif);
          color: #374151;
          line-height: 1.8;
        }
        .prose-article p {
          margin-bottom: 1.25rem;
          font-size: 15px;
        }
        .prose-article h2 {
          font-family: var(--font-merriweather, serif);
          font-size: 20px;
          font-weight: 800;
          color: #02034a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-article ul, .prose-article ol {
          padding-left: 1.4rem;
          margin-bottom: 1.25rem;
        }
        .prose-article li {
          margin-bottom: 0.5rem;
          font-size: 14px;
        }
        .prose-article strong {
          color: #02034a;
          font-weight: 600;
        }
        .prose-article table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-size: 13px;
          border-radius: 10px;
          overflow: hidden;
        }
        .prose-article th {
          background: #02034a;
          color: #fff;
          padding: 10px 14px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
        }
        .prose-article td {
          padding: 9px 14px;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }
        .prose-article tr:nth-child(even) td {
          background: #f7f6fc;
        }
      `}</style>

      <Footer />
    </>
  )
}
