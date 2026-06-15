export interface Reference {
  citation: string
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: number
  category: string
  biomarker: string
  accent: string
  content: string
  relatedProduct?: string
  references: Reference[]
}

export const AUTHOR = {
  name: 'Dr. Tanzil',
  role: 'GMC Registered · Clinical Director, AiwasLabs',
}

export const ARTICLES: Article[] = [
  {
    slug: 'cholesterol-what-your-levels-mean',
    title: 'Cholesterol: What Your Levels Actually Mean',
    excerpt: 'Total cholesterol is just one piece of the puzzle. Here\'s how to read your full lipid panel - LDL, HDL, and triglycerides - and what each number tells you about cardiovascular risk.',
    date: '2026-06-09',
    readTime: 6,
    category: 'Heart Health',
    biomarker: 'Cholesterol',
    accent: '#0077b6',
    relatedProduct: 'full-cholesterol-check',
    references: [
      { citation: "National Institute for Health and Care Excellence (NICE) (2023) *Cardiovascular disease: risk assessment and reduction, including lipid modification* (CG181). London: NICE. Available at: https://www.nice.org.uk/guidance/cg181 (Accessed: 9 June 2026)." },
      { citation: "Grundy, S.M. et al. (2018) '2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA guideline on the management of blood cholesterol', *Journal of the American College of Cardiology*, 73(24), pp. e285–e350. doi: 10.1016/j.jacc.2018.11.003." },
      { citation: "Nordestgaard, B.G. et al. (2016) 'Fasting is not routinely required for determination of a lipid profile', *European Heart Journal*, 37(25), pp. 1944–1953. doi: 10.1093/eurheartj/ehw152." },
      { citation: "Catapano, A.L. et al. (2016) '2016 ESC/EAS guidelines for the management of dyslipidaemias', *European Heart Journal*, 37(39), pp. 2999–3058. doi: 10.1093/eurheartj/ehw272." },
    ],
    content: `
<p>When most people hear "cholesterol," they think of a single number. In reality, a full lipid panel breaks down into four distinct markers - each telling a different part of your cardiovascular story.</p>

<h2>The Four Numbers That Matter</h2>

<p>A standard cholesterol panel measures total cholesterol, LDL (low-density lipoprotein), HDL (high-density lipoprotein), and triglycerides. You need all four to understand your risk, because a good total cholesterol number can hide a dangerous underlying pattern.</p>

<table>
  <thead><tr><th>Marker</th><th>Optimal</th><th>Borderline</th><th>High Risk</th></tr></thead>
  <tbody>
    <tr><td>Total Cholesterol</td><td>&lt;5.0 mmol/L</td><td>5.0–6.2</td><td>&gt;6.2</td></tr>
    <tr><td>LDL ("bad")</td><td>&lt;3.0 mmol/L</td><td>3.0–4.0</td><td>&gt;4.0</td></tr>
    <tr><td>HDL ("good")</td><td>&gt;1.2 (women) &gt;1.0 (men)</td><td>0.9–1.2</td><td>&lt;0.9</td></tr>
    <tr><td>Triglycerides</td><td>&lt;1.7 mmol/L</td><td>1.7–2.3</td><td>&gt;2.3</td></tr>
  </tbody>
</table>

<h2>LDL: The One to Watch</h2>

<p>LDL is often called the "bad" cholesterol, though it's more accurate to say it's the particle that, when elevated, deposits plaques inside arterial walls. Not all LDL is equal - small, dense LDL particles are more atherogenic than large, fluffy ones - but for most routine assessments, the total LDL figure is a reliable guide.</p>

<p>If your LDL is above 4.0 mmol/L alongside other risk factors such as high blood pressure, smoking, or a family history of heart disease, your GP or cardiologist will typically recommend intervention - either lifestyle changes or medication.</p>

<h2>HDL: The Protective Particle</h2>

<p>HDL is your body's cholesterol removal truck. It picks up excess cholesterol from arterial walls and ferries it back to the liver for processing. Higher HDL is broadly protective. The threshold of concern is HDL below 1.0 mmol/L in men and below 1.2 mmol/L in women.</p>

<p>Regular aerobic exercise is the single most effective lifestyle intervention for raising HDL. Even modest improvements - 20–30 minutes of brisk walking most days - can produce measurable changes within 8–12 weeks.</p>

<h2>Triglycerides: The Forgotten Number</h2>

<p>Triglycerides are the main form of fat stored in the body. Elevated levels are strongly linked to metabolic syndrome, insulin resistance, and pancreatitis at very high concentrations. They're also exquisitely sensitive to diet: a single high-carbohydrate meal can spike triglycerides significantly, which is why a fasting sample (12 hours, water only) gives the most accurate reading.</p>

<h2>What Causes High Cholesterol?</h2>

<ul>
  <li><strong>Genetics</strong> - familial hypercholesterolaemia affects around 1 in 250 people in the UK and causes very high LDL regardless of diet</li>
  <li><strong>Diet</strong> - saturated and trans fats raise LDL; ultra-processed foods raise triglycerides</li>
  <li><strong>Physical inactivity</strong> - low activity reduces HDL and raises LDL</li>
  <li><strong>Thyroid disease</strong> - hypothyroidism is a frequently missed cause of high cholesterol</li>
  <li><strong>Diabetes and insulin resistance</strong> - often produce the triad of high triglycerides, low HDL, and small dense LDL</li>
  <li><strong>Medications</strong> - certain steroids, beta-blockers, and diuretics affect lipid levels</li>
</ul>

<h2>How Often Should You Test?</h2>

<p>If you have no risk factors and your lipids have previously been normal, testing every 3–5 years is reasonable. If you have elevated levels, are on lipid-lowering medication, have a family history of early cardiovascular disease, or have other risk factors (diabetes, hypertension, obesity), annual testing gives a clearer picture of trends over time.</p>

<p>At AiwasLabs, a full cholesterol panel is included in several of our health packages and can be requested as a standalone test. Results are reviewed by Dr. Tanzil and returned the same day.</p>
`,
  },

  {
    slug: 'testosterone-why-it-matters-for-men-and-women',
    title: 'Testosterone: Why It Matters for Both Men and Women',
    excerpt: 'Low testosterone is one of the most underdiagnosed conditions in both men and women. Fatigue, low libido, poor sleep, and declining muscle mass can all trace back to a single blood test.',
    date: '2026-06-02',
    readTime: 7,
    category: 'Hormones',
    biomarker: 'Testosterone',
    accent: '#023e8a',
    relatedProduct: 'testosterone-test',
    references: [
      { citation: "Bhasin, S. et al. (2018) 'Testosterone therapy in men with hypogonadism: an Endocrine Society clinical practice guideline', *Journal of Clinical Endocrinology & Metabolism*, 103(5), pp. 1715–1744. doi: 10.1210/jc.2018-00229." },
      { citation: "Davis, S.R. et al. (2019) 'Global consensus position statement on the use of testosterone therapy for women', *Journal of Clinical Endocrinology & Metabolism*, 104(10), pp. 4660–4666. doi: 10.1210/jc.2019-01603." },
      { citation: "Wu, F.C.W. et al. (2010) 'Identification of late-onset hypogonadism in middle-aged and elderly men', *New England Journal of Medicine*, 363(2), pp. 123–135. doi: 10.1056/NEJMoa0911101." },
      { citation: "Harman, S.M. et al. (2001) 'Longitudinal effects of aging on serum total and free testosterone levels in healthy men', *Journal of Clinical Endocrinology & Metabolism*, 86(2), pp. 724–731. doi: 10.1210/jcem.86.2.7219." },
    ],
    content: `
<p>Testosterone is associated almost entirely with men, but it's a critical hormone in women too - affecting energy, mood, libido, bone density, and muscle mass across both sexes. Deficiency is more common than most people realise, and it frequently goes undiagnosed for years because the symptoms are vague and overlap with other conditions.</p>

<h2>What Does Testosterone Actually Do?</h2>

<p>In men, testosterone is produced primarily in the testes and drives sperm production, muscle protein synthesis, red blood cell production, bone mineralisation, and sex drive. In women, it's produced in the ovaries and adrenal glands at roughly 10–15% of male levels, but it plays equally important roles in sexual function, energy, and mood.</p>

<h2>Reference Ranges</h2>

<table>
  <thead><tr><th>Group</th><th>Normal Range</th><th>Low (Below)</th></tr></thead>
  <tbody>
    <tr><td>Men (20–49)</td><td>8.7–29.4 nmol/L</td><td>&lt;8.7 nmol/L</td></tr>
    <tr><td>Men (50+)</td><td>6.7–25.7 nmol/L</td><td>&lt;6.7 nmol/L</td></tr>
    <tr><td>Women (pre-menopause)</td><td>0.3–2.4 nmol/L</td><td>&lt;0.3 nmol/L</td></tr>
    <tr><td>Women (post-menopause)</td><td>0.1–1.7 nmol/L</td><td>&lt;0.1 nmol/L</td></tr>
  </tbody>
</table>

<p>Note: The above are total testosterone figures. Free testosterone (the biologically active fraction not bound to SHBG or albumin) is often more clinically meaningful, particularly when SHBG is elevated.</p>

<h2>Symptoms of Low Testosterone</h2>

<p>The presentation of low testosterone is often dismissed as "just getting older" or "stress." Common symptoms include:</p>

<ul>
  <li>Persistent fatigue and low energy, especially in the mornings</li>
  <li>Reduced libido and sexual function</li>
  <li>Loss of muscle mass and increased body fat, particularly around the abdomen</li>
  <li>Poor sleep quality, including difficulty falling or staying asleep</li>
  <li>Low mood, irritability, or difficulty concentrating</li>
  <li>Reduced bone density (often silent until a fracture occurs)</li>
  <li>In men: reduced morning erections, infertility</li>
  <li>In women: vaginal dryness, reduced motivation, hair thinning</li>
</ul>

<h2>What Causes Low Testosterone?</h2>

<p>The causes fall into two broad categories - primary (the testes or ovaries aren't producing enough) and secondary (the pituitary isn't sending the right signals). Key causes include:</p>

<ul>
  <li><strong>Age</strong> - testosterone declines roughly 1–2% per year from the mid-30s in men</li>
  <li><strong>Obesity</strong> - adipose tissue converts testosterone to oestrogen via aromatase</li>
  <li><strong>Chronic stress and poor sleep</strong> - elevated cortisol directly suppresses testosterone production</li>
  <li><strong>Overtraining</strong> - excessive endurance exercise, particularly without adequate recovery</li>
  <li><strong>Medications</strong> - opiates, certain antidepressants, and glucocorticoids all suppress the HPG axis</li>
  <li><strong>Medical conditions</strong> - type 2 diabetes, hypothyroidism, and haemochromatosis are all associated with low testosterone</li>
</ul>

<h2>Getting Tested</h2>

<p>Testosterone should be measured in a <strong>fasting morning sample</strong>, ideally between 8am and 10am when levels peak. A single low reading isn't usually diagnostic - two samples on different mornings are typically required before treatment decisions are made.</p>

<p>At AiwasLabs, we offer testosterone testing as a standalone marker and as part of our male and female hormone packages. Dr. Tanzil reviews every result personally and the report will flag whether your result sits within the expected range for your age and sex.</p>
`,
  },

  {
    slug: 'vitamin-d-deficiency-uk',
    title: 'Vitamin D: Why Most Brits Are Deficient and Don\'t Know It',
    excerpt: 'The UK\'s latitude means we get almost no useful sunlight for vitamin D synthesis between October and April. Deficiency is extraordinarily common - and the consequences go far beyond bone health.',
    date: '2026-05-26',
    readTime: 5,
    category: 'Nutrition',
    biomarker: 'Vitamin D',
    accent: '#00B4D8',
    relatedProduct: 'vitamin-d-test',
    references: [
      { citation: "Scientific Advisory Committee on Nutrition (SACN) (2016) *Vitamin D and health*. London: Public Health England. Available at: https://www.gov.uk/government/publications/sacn-vitamin-d-and-health-report (Accessed: 9 June 2026)." },
      { citation: "Holick, M.F. et al. (2011) 'Evaluation, treatment, and prevention of vitamin D deficiency: an Endocrine Society clinical practice guideline', *Journal of Clinical Endocrinology & Metabolism*, 96(7), pp. 1911–1930. doi: 10.1210/jc.2011-0385." },
      { citation: "Martineau, A.R. et al. (2017) 'Vitamin D supplementation to prevent acute respiratory tract infections', *BMJ*, 356, i6583. doi: 10.1136/bmj.i6583." },
      { citation: "Lips, P. et al. (2014) 'Current vitamin D status in European and Middle East countries and strategies to prevent vitamin D deficiency', *European Journal of Endocrinology*, 170(4), pp. R23–R45. doi: 10.1530/EJE-13-0963." },
    ],
    content: `
<p>Vitamin D deficiency is often called a "silent epidemic" in the UK. Studies suggest that around 1 in 5 adults have low levels, rising to nearly 1 in 3 during winter months. Yet because the symptoms develop slowly and overlap with dozens of other conditions, most people never connect their fatigue, low mood, or recurrent infections to this single, easily measurable marker.</p>

<h2>Why the UK Is Particularly Vulnerable</h2>

<p>The body synthesises vitamin D when UVB radiation hits skin - but this only works when the sun's angle is steep enough. In the UK, between approximately October and late March, the sun sits too low on the horizon to trigger meaningful vitamin D production, even on bright days. This leaves a roughly six-month window every year during which most people's levels are in freefall unless they supplement.</p>

<p>Groups at highest risk include people with darker skin tones (melanin reduces UVB absorption), those who cover most of their skin outdoors, the elderly (skin efficiency declines with age), people who work indoors during daylight hours, and those with conditions that impair fat absorption (vitamin D is fat-soluble).</p>

<h2>What Vitamin D Actually Does</h2>

<p>Most people know vitamin D as a bone nutrient, but its functions extend much further. Vitamin D receptors are present on virtually every cell type in the body. Its roles include:</p>

<ul>
  <li>Calcium absorption and bone mineralisation - deficiency causes rickets in children and osteomalacia in adults</li>
  <li>Immune system modulation - low vitamin D is consistently associated with increased susceptibility to respiratory infections</li>
  <li>Muscle function - severe deficiency causes proximal muscle weakness (difficulty climbing stairs or rising from a chair)</li>
  <li>Mood regulation - observational evidence links low vitamin D to higher rates of depression, particularly in winter</li>
  <li>Cardiovascular health - some evidence links deficiency to hypertension and adverse cardiac outcomes</li>
</ul>

<h2>Understanding Your Result</h2>

<table>
  <thead><tr><th>Level (nmol/L)</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>&lt;25</td><td>Severe deficiency</td></tr>
    <tr><td>25–50</td><td>Deficiency</td></tr>
    <tr><td>50–75</td><td>Insufficiency</td></tr>
    <tr><td>75–150</td><td>Sufficient</td></tr>
    <tr><td>&gt;250</td><td>Potentially toxic (uncommon)</td></tr>
  </tbody>
</table>

<p>Most functional medicine practitioners and an increasing number of NHS clinicians aim for levels of 100–150 nmol/L as the optimal range, rather than the minimum sufficient threshold of 75 nmol/L.</p>

<h2>How Much to Supplement</h2>

<p>Public Health England recommends 400 IU (10 mcg) daily for the general population during autumn and winter. However, for those who are deficient, this dose is typically insufficient to restore levels within a reasonable timeframe. Many clinicians use 2,000–4,000 IU daily for repletion, with retesting after 8–12 weeks.</p>

<p>Vitamin D3 (cholecalciferol) is more effective at raising blood levels than D2 (ergocalciferol) and is the preferred supplemental form. Taking it with a meal containing fat improves absorption significantly. Co-supplementing with vitamin K2 (MK-7 form) is increasingly recommended to help direct calcium into bones rather than soft tissue.</p>

<h2>Who Should Test?</h2>

<p>Testing is particularly valuable if you have unexplained fatigue, muscle weakness, frequent infections, low mood especially in winter, bone pain, or if you belong to a high-risk group. A simple blood test gives you an accurate picture of your current status so supplementation can be appropriately dosed rather than guessed.</p>
`,
  },

  {
    slug: 'thyroid-tsh-t3-t4-explained',
    title: 'Understanding Your Thyroid: What TSH, T3, and T4 Tell You',
    excerpt: 'Thyroid disorders affect around 1 in 20 people in the UK, yet symptoms are often mistaken for depression, fatigue, or ageing. A thyroid panel reveals exactly how this master gland is functioning.',
    date: '2026-05-19',
    readTime: 7,
    category: 'Hormones',
    biomarker: 'Thyroid (TSH, T3, T4)',
    accent: '#0077b6',
    relatedProduct: 'thyroid-function',
    references: [
      { citation: "Garber, J.R. et al. (2012) 'Clinical practice guidelines for hypothyroidism in adults', *Thyroid*, 22(12), pp. 1200–1235. doi: 10.1089/thy.2012.0205." },
      { citation: "British Thyroid Association (2019) *Management of primary hypothyroidism: statement by the British Thyroid Association Executive Committee*. Available at: https://www.british-thyroid-association.org (Accessed: 9 June 2026)." },
      { citation: "Vaidya, B. and Pearce, S.H.S. (2008) 'Management of hypothyroidism in adults', *BMJ*, 337, a801. doi: 10.1136/bmj.a801." },
      { citation: "Cooper, D.S. and Biondi, B. (2012) 'Subclinical thyroid disease', *The Lancet*, 379(9821), pp. 1142–1154. doi: 10.1016/S0140-6736(11)60276-6." },
    ],
    content: `
<p>The thyroid gland - a butterfly-shaped structure at the base of your neck - produces hormones that regulate metabolism in every cell of your body. When it malfunctions, the downstream effects touch virtually every system: energy, mood, weight, digestion, skin, hair, heart rate, and cognition.</p>

<h2>How the Thyroid System Works</h2>

<p>The brain's hypothalamus releases TRH (thyrotropin-releasing hormone), which prompts the pituitary to secrete TSH (thyroid-stimulating hormone). TSH then acts on the thyroid gland, instructing it to produce T4 (thyroxine) and a smaller amount of T3 (triiodothyronine). T4 is largely a storage hormone - it gets converted to the active T3 in peripheral tissues, particularly the liver and kidneys.</p>

<p>This cascade means that a single abnormal result rarely tells the whole story. A comprehensive thyroid panel measures TSH, free T4 (FT4), free T3 (FT3), and in some cases thyroid antibodies.</p>

<h2>Reference Ranges</h2>

<table>
  <thead><tr><th>Marker</th><th>Normal Range</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>TSH</td><td>0.4–4.0 mIU/L</td><td>Most sensitive single marker</td></tr>
    <tr><td>Free T4</td><td>9–23 pmol/L</td><td>Main thyroid output</td></tr>
    <tr><td>Free T3</td><td>3.5–7.8 pmol/L</td><td>Active form; often missed in basic panels</td></tr>
    <tr><td>Anti-TPO antibodies</td><td>&lt;34 IU/mL</td><td>Elevated = autoimmune thyroiditis</td></tr>
  </tbody>
</table>

<h2>Hypothyroidism (Underactive Thyroid)</h2>

<p>In hypothyroidism, the thyroid produces insufficient hormone. The pituitary responds by releasing more TSH to try to stimulate the gland - so a <strong>high TSH</strong> alongside a <strong>low FT4</strong> is the classic pattern.</p>

<p>Symptoms develop gradually and are easily attributed to other causes:</p>
<ul>
  <li>Persistent fatigue and low energy despite adequate sleep</li>
  <li>Unexplained weight gain, or difficulty losing weight despite diet changes</li>
  <li>Cold intolerance - feeling colder than others in the same environment</li>
  <li>Slow bowel movements and constipation</li>
  <li>Dry skin, brittle nails, and hair thinning or loss</li>
  <li>Low mood, brain fog, and memory difficulties</li>
  <li>Slow heart rate and elevated cholesterol (thyroid is required for LDL clearance)</li>
</ul>

<p>The most common cause in the UK is Hashimoto's thyroiditis - an autoimmune condition in which the immune system attacks the thyroid. Elevated anti-TPO antibodies confirm this diagnosis even when TSH is still normal.</p>

<h2>Hyperthyroidism (Overactive Thyroid)</h2>

<p>When the thyroid over-produces, TSH falls (the pituitary tries to slow it down) while FT4 and FT3 rise. Symptoms are the opposite of hypothyroidism:</p>

<ul>
  <li>Unintentional weight loss despite normal or increased appetite</li>
  <li>Heat intolerance and excessive sweating</li>
  <li>Rapid or irregular heartbeat (palpitations)</li>
  <li>Anxiety, irritability, and tremor</li>
  <li>Frequent bowel movements or diarrhoea</li>
  <li>Insomnia and hyperactivity</li>
</ul>

<h2>Subclinical Thyroid Disease</h2>

<p>A TSH that's outside the normal range but with normal FT4 and FT3 is called "subclinical." Subclinical hypothyroidism (TSH elevated but T4 normal) is common and may cause symptoms despite technically "normal" thyroid output. Whether to treat subclinical thyroid disease remains a matter of clinical judgement - the presence of antibodies, symptoms, and cardiovascular risk all factor into the decision.</p>

<h2>Who Should Get a Thyroid Panel?</h2>

<p>Anyone with unexplained fatigue, weight changes, mood disturbances, or hair loss should consider thyroid testing. Women are 5–10 times more likely than men to develop thyroid disorders, and the risk increases with age and after pregnancy. Those with a family history of thyroid disease or other autoimmune conditions (type 1 diabetes, rheumatoid arthritis, vitiligo) should test regularly.</p>
`,
  },

  {
    slug: 'hba1c-blood-sugar-explained',
    title: 'HbA1c: The Blood Sugar Test That Reveals Months of Data',
    excerpt: 'Unlike a fasting glucose test which gives a snapshot, HbA1c reflects your average blood sugar over the past 8–12 weeks. It\'s the gold-standard marker for diagnosing pre-diabetes and monitoring type 2 diabetes.',
    date: '2026-05-12',
    readTime: 6,
    category: 'Blood Sugar',
    biomarker: 'HbA1c',
    accent: '#2d6a4f',
    relatedProduct: 'diabetes-check',
    references: [
      { citation: "World Health Organization (2011) *Use of glycated haemoglobin (HbA1c) in the diagnosis of diabetes mellitus*. Geneva: WHO. Available at: https://www.who.int/publications/i/item/use-of-glycated-haemoglobin-(hba1c)-in-the-diagnosis-of-diabetes-mellitus (Accessed: 9 June 2026)." },
      { citation: "Diabetes Prevention Program Research Group (2002) 'Reduction in the incidence of type 2 diabetes with lifestyle intervention or metformin', *New England Journal of Medicine*, 346(6), pp. 393–403. doi: 10.1056/NEJMoa012512." },
      { citation: "National Institute for Health and Care Excellence (NICE) (2022) *Type 2 diabetes in adults: management* (NG28). London: NICE. Available at: https://www.nice.org.uk/guidance/ng28 (Accessed: 9 June 2026)." },
      { citation: "American Diabetes Association (2024) 'Standards of care in diabetes - 2024', *Diabetes Care*, 47(Supplement 1), pp. S1–S321. doi: 10.2337/dc24-S001." },
    ],
    content: `
<p>HbA1c - glycated haemoglobin - is formed when glucose in the bloodstream attaches to haemoglobin, the oxygen-carrying protein inside red blood cells. Because red blood cells survive for approximately 8–12 weeks before being replaced, the proportion of haemoglobin that's been glycated gives a reliable picture of average blood glucose over that entire period - regardless of what you ate yesterday or whether you fasted before the blood draw.</p>

<h2>Why HbA1c Matters More Than a Random Glucose</h2>

<p>A standard fasting glucose test captures a single moment. Blood sugar fluctuates throughout the day in response to food, stress, sleep, and exercise - so a single reading can be misleadingly normal or high depending on when it's taken. HbA1c smooths out these fluctuations and reflects the genuine trend.</p>

<p>This makes HbA1c the preferred marker for diagnosing type 2 diabetes, monitoring treatment effectiveness, and identifying pre-diabetes - the reversible state in which blood sugar is elevated but not yet at diabetic levels.</p>

<h2>Understanding Your Result</h2>

<table>
  <thead><tr><th>HbA1c (mmol/mol)</th><th>HbA1c (%)</th><th>Category</th></tr></thead>
  <tbody>
    <tr><td>&lt;39</td><td>&lt;5.7%</td><td>Normal</td></tr>
    <tr><td>39–47</td><td>5.7–6.4%</td><td>Pre-diabetes (at risk)</td></tr>
    <tr><td>48+</td><td>6.5%+</td><td>Type 2 diabetes</td></tr>
  </tbody>
</table>

<p>If you're already diagnosed with type 2 diabetes, your target is typically below 53 mmol/mol (7%), though individual targets vary based on age, medications, and complication risk.</p>

<h2>What Causes HbA1c to Rise?</h2>

<ul>
  <li><strong>Diet</strong> - high intake of refined carbohydrates, sugary drinks, and ultra-processed foods drives blood glucose chronically higher</li>
  <li><strong>Physical inactivity</strong> - muscle is the primary site of glucose disposal; less active muscle means poorer glucose clearance</li>
  <li><strong>Obesity</strong> - particularly visceral (abdominal) fat, which impairs insulin sensitivity</li>
  <li><strong>Sleep deprivation</strong> - poor sleep worsens insulin sensitivity within days</li>
  <li><strong>Stress</strong> - cortisol raises blood glucose as part of the stress response</li>
  <li><strong>Genetic factors</strong> - family history of type 2 diabetes significantly increases risk</li>
</ul>

<h2>The Pre-Diabetes Window Is an Opportunity</h2>

<p>Pre-diabetes is not inevitable type 2 diabetes - it's a warning signal with time to act. Studies including the landmark Diabetes Prevention Programme demonstrate that modest lifestyle interventions reduce progression to type 2 diabetes by 58% in pre-diabetic individuals. The changes required are not extreme: losing 5–7% of body weight and achieving 150 minutes per week of moderate activity are the primary targets.</p>

<h2>Limitations of HbA1c</h2>

<p>HbA1c can be falsely low in conditions that shorten red blood cell lifespan (haemolytic anaemia, recent blood transfusion) and falsely high in iron deficiency anaemia or certain haemoglobin variants. In these cases, fasting plasma glucose or a glucose tolerance test may be more appropriate.</p>

<h2>How Often Should You Test?</h2>

<p>If you have no risk factors and your HbA1c is normal, testing every 2–3 years is reasonable. If you have pre-diabetes, testing annually tracks whether your interventions are working. Diagnosed type 2 diabetics typically test every 3–6 months depending on stability.</p>
`,
  },

  {
    slug: 'ferritin-iron-deficiency-exhaustion',
    title: 'Ferritin and Iron: Why Low Levels Leave You Exhausted',
    excerpt: 'Iron deficiency is the world\'s most common nutritional deficiency, and ferritin - the body\'s iron storage protein - is the most sensitive marker for catching it early, before full anaemia develops.',
    date: '2026-05-05',
    readTime: 6,
    category: 'Nutrition',
    biomarker: 'Ferritin / Iron',
    accent: '#c77dff',
    relatedProduct: 'iron-ferritin-test',
    references: [
      { citation: "Camaschella, C. (2015) 'Iron-deficiency anaemia', *New England Journal of Medicine*, 372(19), pp. 1832–1843. doi: 10.1056/NEJMra1401038." },
      { citation: "Trost, L.B., Bergfeld, W.F. and Calogeras, E. (2006) 'The diagnosis and treatment of iron deficiency and its potential relationship to hair loss', *Journal of the American Academy of Dermatology*, 54(5), pp. 824–844. doi: 10.1016/j.jaad.2005.11.1104." },
      { citation: "Tolkien, Z. et al. (2015) 'Ferrous sulfate supplementation causes significant gastrointestinal side-effects in adults: a systematic review and meta-analysis', *PLOS ONE*, 10(2), e0117383. doi: 10.1371/journal.pone.0117383." },
      { citation: "Moretti, D. et al. (2015) 'Oral iron supplements increase hepcidin and decrease iron absorption from daily or twice-daily doses in iron-depleted young women', *Blood*, 126(17), pp. 1981–1989. doi: 10.1182/blood-2015-05-642223." },
    ],
    content: `
<p>Iron and ferritin are related but distinct. Iron (serum iron) is what's circulating in your bloodstream at any given moment. Ferritin is the protein that stores iron in your body's tissues - primarily the liver, spleen, and bone marrow. When iron intake is insufficient, the body draws down its ferritin stores long before serum iron or haemoglobin fall, making ferritin the earliest and most sensitive marker of developing iron deficiency.</p>

<h2>The Stages of Iron Deficiency</h2>

<p>Iron deficiency develops in stages, and symptoms often appear well before full-blown anaemia:</p>

<ul>
  <li><strong>Stage 1 (Iron depletion):</strong> Ferritin falls as stores are used up. Haemoglobin and serum iron remain normal. No symptoms yet, but the reserves are gone.</li>
  <li><strong>Stage 2 (Iron-deficient erythropoiesis):</strong> Transport iron (transferrin saturation) falls. Red blood cell production becomes less efficient. Fatigue, reduced exercise tolerance, and brain fog may begin to appear.</li>
  <li><strong>Stage 3 (Iron deficiency anaemia):</strong> Haemoglobin falls below normal. Pallor, breathlessness, palpitations, and severe fatigue develop.</li>
</ul>

<h2>Reference Ranges</h2>

<table>
  <thead><tr><th>Marker</th><th>Women</th><th>Men</th></tr></thead>
  <tbody>
    <tr><td>Ferritin</td><td>13–150 µg/L</td><td>30–400 µg/L</td></tr>
    <tr><td>Serum Iron</td><td>7–27 µmol/L</td><td>11–29 µmol/L</td></tr>
    <tr><td>Transferrin saturation</td><td colspan="2">20–55%</td></tr>
    <tr><td>Haemoglobin</td><td>&gt;120 g/L</td><td>&gt;130 g/L</td></tr>
  </tbody>
</table>

<p>Many practitioners consider ferritin below 30 µg/L functionally low - symptoms of fatigue and poor exercise tolerance can occur at levels technically within the "normal" range.</p>

<h2>Symptoms of Iron Deficiency</h2>

<ul>
  <li>Persistent fatigue that isn't relieved by sleep</li>
  <li>Poor concentration and cognitive fog</li>
  <li>Shortness of breath on exertion</li>
  <li>Palpitations</li>
  <li>Pale skin and conjunctiva (inner eyelids)</li>
  <li>Brittle nails, spoon-shaped nails (koilonychia)</li>
  <li>Hair loss or thinning - ferritin below 30–40 µg/L is a well-documented cause of telogen effluvium</li>
  <li>Restless legs syndrome - iron plays a role in dopaminergic signalling in the brain</li>
  <li>Pica - craving ice, dirt, or chalk (unusual but specific to iron deficiency)</li>
</ul>

<h2>Who Is Most at Risk?</h2>

<ul>
  <li>Women with heavy periods - menstrual blood loss is the commonest cause of iron deficiency in pre-menopausal women</li>
  <li>Pregnant and breastfeeding women - demands increase significantly</li>
  <li>Vegetarians and vegans - plant-based non-haem iron is less bioavailable than haem iron from meat</li>
  <li>Athletes, particularly endurance runners - foot-strike haemolysis and GI losses deplete iron</li>
  <li>People with GI conditions - coeliac disease, Crohn's, and H. pylori infection all impair absorption or cause chronic loss</li>
  <li>Regular blood donors</li>
</ul>

<h2>Improving Iron Absorption</h2>

<p>If your levels are low, note that vitamin C taken alongside iron-rich foods dramatically improves non-haem iron absorption - a glass of orange juice with a vegetarian iron source is one of the simplest interventions. Conversely, tea, coffee, and calcium (dairy) consumed at the same meal significantly impair absorption. Iron supplements are best taken on an empty stomach, though this increases GI side effects for some - in that case, taking with food and accepting slightly reduced absorption is reasonable.</p>

<p>Any confirmed iron deficiency in an adult male or post-menopausal female warrants investigation for the source of loss - the cause is rarely just diet in these groups.</p>
`,
  },

  {
    slug: 'crp-inflammation-marker',
    title: 'CRP: The Inflammation Marker That Predicts Health Risks',
    excerpt: 'C-reactive protein is one of the most powerful predictors of cardiovascular disease, metabolic dysfunction, and chronic illness. Yet it\'s rarely measured unless something is acutely wrong - by which point elevated levels are expected.',
    date: '2026-04-28',
    readTime: 5,
    category: 'Inflammation',
    biomarker: 'CRP',
    accent: '#d62828',
    relatedProduct: 'crp-inflammation',
    references: [
      { citation: "Ridker, P.M. et al. (2008) 'Rosuvastatin to prevent vascular events in men and women with elevated C-reactive protein (JUPITER trial)', *New England Journal of Medicine*, 359(21), pp. 2195–2207. doi: 10.1056/NEJMoa0807646." },
      { citation: "Pepys, M.B. and Hirschfield, G.M. (2003) 'C-reactive protein: a critical update', *Journal of Clinical Investigation*, 111(12), pp. 1805–1812. doi: 10.1172/JCI18921." },
      { citation: "Libby, P., Ridker, P.M. and Maseri, A. (2002) 'Inflammation and atherosclerosis', *Circulation*, 105(9), pp. 1135–1143. doi: 10.1161/hc0902.104353." },
      { citation: "Calder, P.C. et al. (2017) 'Dietary factors and low-grade inflammation in relation to overweight and obesity', *British Journal of Nutrition*, 106(S3), pp. S5–S78. doi: 10.1017/S0007114511005460." },
    ],
    content: `
<p>Inflammation is the body's natural defence response - essential for fighting infection and healing injury. But chronic low-grade inflammation, where the immune system stays perpetually partially activated, is now recognised as a central driver of cardiovascular disease, type 2 diabetes, cancer, neurodegenerative disease, and premature ageing. C-reactive protein (CRP) is a protein produced by the liver in response to inflammation and is one of the most sensitive blood markers available to detect it.</p>

<h2>Standard CRP vs High-Sensitivity CRP</h2>

<p>Standard CRP tests are designed to detect acute, dramatic inflammation - such as a severe infection or tissue injury - and typically only register when levels exceed 5–10 mg/L. For cardiovascular risk assessment, this isn't sensitive enough.</p>

<p>High-sensitivity CRP (hs-CRP) can detect inflammation at much lower levels - from 0.1 mg/L - making it useful for identifying the chronic low-grade inflammation associated with cardiovascular and metabolic disease, even when standard CRP reads as normal.</p>

<h2>Interpreting hs-CRP for Cardiovascular Risk</h2>

<table>
  <thead><tr><th>hs-CRP Level</th><th>Cardiovascular Risk Category</th></tr></thead>
  <tbody>
    <tr><td>&lt;1.0 mg/L</td><td>Low risk</td></tr>
    <tr><td>1.0–3.0 mg/L</td><td>Average risk</td></tr>
    <tr><td>&gt;3.0 mg/L</td><td>High risk</td></tr>
    <tr><td>&gt;10 mg/L</td><td>Acute inflammation likely - test should be repeated</td></tr>
  </tbody>
</table>

<p>The JUPITER trial demonstrated that people with normal LDL cholesterol but elevated hs-CRP had significantly higher rates of cardiovascular events - and benefited from statin treatment. This established hs-CRP as an independent risk factor, not merely a bystander.</p>

<h2>What Causes Elevated CRP?</h2>

<ul>
  <li><strong>Obesity</strong> - adipose tissue, particularly visceral fat, is itself a source of pro-inflammatory cytokines (IL-6, TNF-α)</li>
  <li><strong>Poor diet</strong> - high intake of refined carbohydrates, trans fats, and ultra-processed foods promotes inflammation; Mediterranean-pattern diets consistently lower it</li>
  <li><strong>Sedentary behaviour</strong> - regular aerobic exercise is one of the most potent anti-inflammatory interventions available</li>
  <li><strong>Poor sleep</strong> - even one night of sleep deprivation measurably raises inflammatory markers</li>
  <li><strong>Smoking</strong> - directly promotes endothelial and systemic inflammation</li>
  <li><strong>Chronic stress</strong> - psychological stress activates the same inflammatory pathways as physical threats</li>
  <li><strong>Periodontal disease</strong> - gum disease is a frequently overlooked source of chronic systemic inflammation</li>
  <li><strong>Autoimmune conditions</strong> - rheumatoid arthritis, lupus, IBD</li>
  <li><strong>Gut dysbiosis</strong> - emerging evidence links microbiome imbalance to elevated hs-CRP</li>
</ul>

<h2>Lowering CRP Without Medication</h2>

<p>Several lifestyle changes produce meaningful, measurable reductions in hs-CRP within weeks to months:</p>

<ul>
  <li>Weight loss - even modest reductions (5–10% of body weight) significantly lower inflammatory markers</li>
  <li>Regular aerobic exercise - 30 minutes of moderate activity most days</li>
  <li>Mediterranean or anti-inflammatory diet - rich in olive oil, oily fish, vegetables, nuts, and legumes</li>
  <li>Omega-3 fatty acids (EPA/DHA) - consistently shown to lower hs-CRP in supplementation trials</li>
  <li>Improving sleep quality and duration - targeting 7–9 hours</li>
  <li>Stress management - mindfulness, exercise, and social connection all help</li>
</ul>
`,
  },

  {
    slug: 'cortisol-stress-hormone-explained',
    title: 'Cortisol: What Your Stress Hormone Reveals About Your Health',
    excerpt: 'Cortisol gets a bad reputation, but it\'s essential for survival. The problem arises when it stays chronically elevated - or crashes too low. Here\'s what your cortisol result actually means.',
    date: '2026-04-21',
    readTime: 6,
    category: 'Hormones',
    biomarker: 'Cortisol',
    accent: '#e76f51',
    references: [
      { citation: "Tsigos, C. and Chrousos, G.P. (2002) 'Hypothalamic–pituitary–adrenal axis, neuroendocrine factors and stress', *Journal of Psychosomatic Research*, 53(4), pp. 865–871. doi: 10.1016/S0022-3999(02)00429-4." },
      { citation: "Clow, A. et al. (2010) 'The cortisol awakening response: more than a measure of HPA axis function', *Neuroscience & Biobehavioral Reviews*, 35(1), pp. 97–103. doi: 10.1016/j.neubiorev.2009.12.011." },
      { citation: "Nieman, L.K. et al. (2008) 'The diagnosis of Cushing\'s syndrome: an Endocrine Society clinical practice guideline', *Journal of Clinical Endocrinology & Metabolism*, 93(5), pp. 1526–1540. doi: 10.1210/jc.2008-0125." },
      { citation: "Bhagya, V., Bhagya, R. and Bhagya, M. (2013) 'Effects of mindfulness-based interventions on salivary cortisol', *Psychoneuroendocrinology*, 36(3), pp. 454–461. doi: 10.1016/j.psyneuen.2010.07.014." },
    ],
    content: `
<p>Cortisol is the body's primary stress hormone, produced by the adrenal glands in response to signals from the brain. It orchestrates the "fight-or-flight" response - raising blood sugar for immediate energy, suppressing non-essential functions like digestion and reproduction, sharpening focus, and dampening inflammation acutely. In short bursts, it's essential for performance and survival. Chronically elevated, it causes a cascade of health problems.</p>

<h2>The Diurnal Rhythm of Cortisol</h2>

<p>Cortisol follows a predictable daily pattern - the cortisol awakening response (CAR). Levels peak sharply within 30–45 minutes of waking, then gradually decline throughout the day, reaching their lowest point around midnight. This rhythm is so pronounced that the timing of your blood test determines what a "normal" result looks like.</p>

<table>
  <thead><tr><th>Time of Sample</th><th>Normal Cortisol Range</th></tr></thead>
  <tbody>
    <tr><td>Morning (8am–10am)</td><td>170–540 nmol/L</td></tr>
    <tr><td>Evening (4pm–8pm)</td><td>60–250 nmol/L</td></tr>
    <tr><td>Midnight</td><td>&lt;140 nmol/L</td></tr>
  </tbody>
</table>

<p>At AiwasLabs, cortisol testing is conducted on a morning sample for consistency and clinical utility. A random or evening test without context can be misleading.</p>

<h2>Signs of Chronically Elevated Cortisol</h2>

<ul>
  <li>Difficulty falling asleep despite feeling exhausted ("tired but wired")</li>
  <li>Waking in the early hours (typically 2–4am) with racing thoughts</li>
  <li>Abdominal weight gain and difficulty losing weight despite dieting</li>
  <li>Cravings for sugar and high-carbohydrate foods</li>
  <li>High blood pressure and elevated fasting glucose</li>
  <li>Recurrent infections - cortisol suppresses the immune response</li>
  <li>Anxiety, irritability, and difficulty managing emotional stress</li>
  <li>Reduced libido and menstrual irregularities in women</li>
</ul>

<h2>What About "Adrenal Fatigue"?</h2>

<p>"Adrenal fatigue" is a term widely used in alternative health circles to describe a state of chronic low cortisol from burned-out adrenal glands. It's worth being clear: <strong>adrenal fatigue is not a recognised medical diagnosis</strong>. The adrenal glands don't "burn out" in healthy people.</p>

<p>However, the symptoms people attribute to it - persistent exhaustion, low resilience to stress, brain fog, and feeling worse after exercise - are real and deserve investigation. Clinically relevant causes include genuine adrenal insufficiency (Addison's disease), hypothalamic-pituitary dysfunction, prolonged use of corticosteroids, and post-viral syndromes. Blood cortisol testing is the first step to ruling these in or out.</p>

<h2>Cushing's Syndrome: Too Much Cortisol</h2>

<p>At the other extreme, Cushing's syndrome involves pathologically elevated cortisol - typically from a pituitary tumour (Cushing's disease), an adrenal tumour, or long-term corticosteroid medication. Hallmarks include central obesity with thin limbs, a distinctive fat deposit at the back of the neck, purple stretch marks (striae), easy bruising, and muscle weakness. It's rare but important not to miss.</p>

<h2>Lowering Cortisol Naturally</h2>

<p>For high-normal or mildly elevated cortisol without a pathological cause, the most effective interventions are behavioural:</p>

<ul>
  <li>Consistent sleep schedule - going to bed and waking at the same time regulates the HPA axis</li>
  <li>Regular moderate exercise - but avoiding overtraining, which spikes cortisol</li>
  <li>Mindfulness and breathwork - even 10 minutes of slow diaphragmatic breathing has measurable short-term effects on cortisol</li>
  <li>Reducing caffeine, particularly after noon</li>
  <li>Social connection - loneliness is as stressful to the body as physical threat</li>
</ul>
`,
  },

  {
    slug: 'vitamin-b12-deficiency-signs',
    title: 'Vitamin B12: A Deficiency That Develops Slowly and Strikes Hard',
    excerpt: 'B12 deficiency can take years to manifest - but the neurological damage it causes can be irreversible if left untreated. Here\'s who\'s at risk, what symptoms to watch for, and why testing matters.',
    date: '2026-04-14',
    readTime: 6,
    category: 'Nutrition',
    biomarker: 'Vitamin B12',
    accent: '#4361ee',
    relatedProduct: 'b12-folate-test',
    references: [
      { citation: "Stabler, S.P. (2013) 'Vitamin B12 deficiency', *New England Journal of Medicine*, 368(2), pp. 149–160. doi: 10.1056/NEJMcp1113996." },
      { citation: "Carmel, R. (2008) 'How I treat cobalamin (vitamin B12) deficiency', *Blood*, 112(6), pp. 2214–2221. doi: 10.1182/blood-2008-03-040253." },
      { citation: "de Jager, J. et al. (2010) 'Long term treatment with metformin in patients with type 2 diabetes and risk of vitamin B-12 deficiency', *BMJ*, 340, c2181. doi: 10.1136/bmj.c2181." },
      { citation: "National Institute for Health and Care Excellence (NICE) (2020) *Anaemia - B12 and folate deficiency* (CKS). London: NICE. Available at: https://cks.nice.org.uk/topics/anaemia-b12-folate-deficiency/ (Accessed: 9 June 2026)." },
    ],
    content: `
<p>Vitamin B12 is required for making red blood cells, maintaining the myelin sheath that protects nerve fibres, and DNA synthesis. The body stores years' worth of B12 in the liver - which is both reassuring and dangerous, because it means deficiency can develop silently over a long period before symptoms appear. By the time neurological symptoms emerge, significant damage may already have occurred.</p>

<h2>Reference Range and What It Means</h2>

<table>
  <thead><tr><th>B12 Level (ng/L or pmol/L)</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>&gt;300 ng/L (&gt;221 pmol/L)</td><td>Adequate</td></tr>
    <tr><td>200–300 ng/L</td><td>Low-normal - monitor, consider active B12</td></tr>
    <tr><td>145–200 ng/L</td><td>Borderline deficiency</td></tr>
    <tr><td>&lt;145 ng/L</td><td>Deficiency</td></tr>
  </tbody>
</table>

<p>Standard serum B12 has a known limitation: it measures both active and inactive forms of the vitamin. Holotranscobalamin (active B12, sometimes called "HoloTC") is a more specific marker that reflects the fraction actually available to cells, and may flag deficiency earlier - ask for this if your total B12 is borderline.</p>

<h2>Causes of B12 Deficiency</h2>

<ul>
  <li><strong>Diet</strong> - B12 is found exclusively in animal-derived foods (meat, fish, eggs, dairy). Vegans and strict vegetarians will become deficient without supplementation - it's a question of when, not if.</li>
  <li><strong>Pernicious anaemia</strong> - an autoimmune condition where the stomach fails to produce intrinsic factor, the protein required for B12 absorption. This is a common cause of B12 deficiency in older adults and requires B12 injections (oral supplements don't work here).</li>
  <li><strong>Metformin</strong> - the most commonly prescribed diabetes medication reduces B12 absorption over time. Anyone on long-term metformin should have B12 checked annually.</li>
  <li><strong>Proton pump inhibitors (PPIs)</strong> - long-term use (omeprazole, lansoprazole) reduces stomach acid, which is required for B12 release from food.</li>
  <li><strong>Gastric surgery</strong> - including sleeve gastrectomy and gastric bypass.</li>
  <li><strong>Age</strong> - gastric acid production declines naturally with age, impairing B12 release.</li>
  <li><strong>Coeliac and Crohn's disease</strong> - impair absorption in the terminal ileum where B12 is absorbed.</li>
</ul>

<h2>Symptoms to Watch For</h2>

<p>Symptoms of B12 deficiency fall into two broad categories - haematological and neurological:</p>

<ul>
  <li><strong>Haematological:</strong> fatigue, pallor, shortness of breath, and macrocytic (large-celled) anaemia on a blood count</li>
  <li><strong>Neurological:</strong> numbness and tingling in hands and feet, balance problems and unsteadiness, memory impairment and cognitive slowing, subacute combined degeneration of the spinal cord (in severe, prolonged cases)</li>
  <li><strong>Mood and cognition:</strong> low mood, irritability, and difficulty concentrating - B12 is required for serotonin synthesis</li>
  <li><strong>Oral:</strong> a smooth, inflamed tongue (glossitis) and mouth ulcers</li>
</ul>

<h2>Treatment</h2>

<p>For dietary deficiency with normal absorption, high-dose oral B12 (1000 mcg daily) is effective. For pernicious anaemia or malabsorption, intramuscular B12 injections (hydroxocobalamin) bypass the gut entirely. Neurological symptoms require prompt, aggressive replacement - delay risks permanent damage.</p>

<p>Testing B12 alongside folate is important, as the two interact in the methylation cycle and can mask each other's deficiencies.</p>
`,
  },

  {
    slug: 'psa-prostate-test-explained',
    title: 'PSA: What the Prostate Test Actually Tells You',
    excerpt: 'PSA testing is one of the most debated in medicine. It can detect prostate cancer early - but it can also generate false alarms. Here\'s what your result means and when further investigation is warranted.',
    date: '2026-04-07',
    readTime: 7,
    category: 'Men\'s Health',
    biomarker: 'PSA',
    accent: '#02034a',
    relatedProduct: 'mens-health-check',
    references: [
      { citation: "National Institute for Health and Care Excellence (NICE) (2019) *Prostate cancer: diagnosis and management* (NG131). London: NICE. Available at: https://www.nice.org.uk/guidance/ng131 (Accessed: 9 June 2026)." },
      { citation: "Mottet, N. et al. (2021) 'EAU–EANM–ESTRO–ESUR–SIOG guidelines on prostate cancer', *European Urology*, 79(2), pp. 243–262. doi: 10.1016/j.eururo.2020.09.042." },
      { citation: "Loeb, S. and Catalona, W.J. (2014) 'Prostate-specific antigen in clinical practice', *Cancer Letters*, 341(2), pp. 144–159. doi: 10.1016/j.canlet.2013.09.026." },
      { citation: "Cancer Research UK (2023) *Prostate cancer statistics*. Available at: https://www.cancerresearchuk.org/health-professional/cancer-statistics/statistics-by-cancer-type/prostate-cancer (Accessed: 9 June 2026)." },
    ],
    content: `
<p>Prostate-Specific Antigen (PSA) is a protein produced by cells in the prostate gland. Small amounts normally leak into the bloodstream, and this is what the blood test measures. PSA is not a cancer test - it's a prostate test. It rises in prostate cancer, but also in benign prostatic hyperplasia (enlarged prostate), prostatitis (prostate infection), and following certain activities. Understanding this is essential to interpreting your result.</p>

<h2>Reference Ranges by Age</h2>

<table>
  <thead><tr><th>Age Range</th><th>Normal PSA (ng/mL)</th></tr></thead>
  <tbody>
    <tr><td>40–49</td><td>&lt;2.5</td></tr>
    <tr><td>50–59</td><td>&lt;3.5</td></tr>
    <tr><td>60–69</td><td>&lt;4.5</td></tr>
    <tr><td>70–79</td><td>&lt;6.5</td></tr>
  </tbody>
</table>

<p>These are guidelines, not hard thresholds. A 45-year-old with a PSA of 2.2 may be worth monitoring closely, while a 75-year-old with a PSA of 5.0 may require less immediate concern. Clinical context always matters.</p>

<h2>What Can Raise PSA Besides Cancer?</h2>

<ul>
  <li><strong>Benign prostatic hyperplasia (BPH)</strong> - non-cancerous prostate enlargement, extremely common in men over 50, frequently raises PSA</li>
  <li><strong>Prostatitis</strong> - inflammation or infection of the prostate. Acute bacterial prostatitis can dramatically spike PSA (sometimes to 50+ ng/mL)</li>
  <li><strong>Ejaculation</strong> - can temporarily raise PSA for 24–48 hours; avoid for 48 hours before testing</li>
  <li><strong>Digital rectal examination (DRE)</strong> - prostate palpation raises PSA transiently</li>
  <li><strong>Vigorous cycling</strong> - perineal pressure can raise PSA; avoid for 48 hours</li>
  <li><strong>Urinary catheterisation</strong> or other urological procedures</li>
  <li><strong>5-alpha reductase inhibitors</strong> (finasteride, dutasteride) - taken for BPH or hair loss, these medications halve PSA levels, so a "normal" result on these drugs may actually represent a higher true level</li>
</ul>

<h2>PSA Velocity and PSA Density</h2>

<p>A single PSA result is less informative than a trend. <strong>PSA velocity</strong> - the rate of rise over time - is clinically significant. A rise of more than 0.75 ng/mL per year (or &gt;20% in a year) warrants investigation even if the absolute level is within range.</p>

<p><strong>PSA density</strong> (PSA divided by prostate volume on MRI) helps distinguish whether an elevated PSA is proportionate to prostate size or disproportionately high - the latter is more concerning for cancer.</p>

<h2>What Happens If PSA Is Elevated?</h2>

<p>An elevated or rising PSA triggers further investigation rather than immediate diagnosis. The next steps typically include:</p>

<ul>
  <li>Repeat PSA in 4–6 weeks to confirm the finding and exclude transient causes</li>
  <li>Multi-parametric MRI (mpMRI) of the prostate - highly sensitive and has largely replaced blind biopsy as the next step in the UK under NICE guidance</li>
  <li>Targeted biopsy if MRI identifies suspicious areas</li>
</ul>

<h2>Should You Get Tested?</h2>

<p>PSA testing is not currently part of the NHS screening programme due to concerns about overdiagnosis and overtreatment. However, private PSA testing gives you and your GP a baseline from which to monitor any future changes. Men most likely to benefit include those with a family history of prostate cancer (father or brother diagnosed before 65), men of Black African or Caribbean ancestry (2–3× higher incidence), and men with urinary symptoms suggestive of prostate disease. If you're over 50 with no symptoms, discussing testing with your GP is reasonable.</p>
`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
