/**
 * One-time migration: upload product images to UploadThing and seed products,
 * test_info, and FAQs into the database.
 *
 * Run from the admin directory:
 *   cd admin && node ../database/migrate-products.cjs
 */

'use strict'

const ADMIN_MODULES = "/Volumes/Hanif's SSD/Projects/aiwaslabs/Websites/aiwaslabs/admin/node_modules"
const { UTApi }  = require(`${ADMIN_MODULES}/uploadthing/server`)
const { Pool }   = require(`${ADMIN_MODULES}/pg`)
const fs         = require('fs')
const path       = require('path')

const UPLOADTHING_TOKEN  = 'eyJhcGlLZXkiOiJza19saXZlX2VlZTcyMTRhMTM5YWUwYjZlYWI0ZTM4MGJiYmQ3ZjYzNDU2ZTdlMGM0NTEzZTllMzkzYzlmNGM3MTdmMjAzYmQiLCJhcHBJZCI6ImdpNXM5ZnRtcGYiLCJyZWdpb25zIjpbInNlYTEiXX0='
const DATABASE_URL        = 'postgresql://neondb_owner:npg_5VKHYyzOu1kA@ep-sweet-heart-ab474jba.eu-west-2.aws.neon.tech/neondb?sslmode=require'
const IMAGES_BASE         = "/Volumes/Hanif's SSD/Projects/aiwaslabs/Products"
const EXTRACTED_JSON_PATH = "/Volumes/Hanif's SSD/Projects/aiwaslabs/Websites/Aiwas/extracted-products.json"

const utapi          = new UTApi({ token: UPLOADTHING_TOKEN })
const pool           = new Pool({ connectionString: DATABASE_URL })
const extractedData  = JSON.parse(fs.readFileSync(EXTRACTED_JSON_PATH, 'utf8'))

// ─── Image file map ───────────────────────────────────────────────────────────
const IMAGE_FILES = {
  'Testosterone':               'Testosterone.png',
  'Thyroid':                    'Thyroid.png',
  'CompleteBloodCount':         'CompleteBloodCount.png',
  'LiverFunction':              'Liver Function.png',
  'LipidProfile':               'Lipid profile.png',
  'AdvancedKidney':             'advanced-kidney-electrolyte-screen.png',
  'KidneyFunction':             'Kidney Function.png',
  'Pancreas':                   'Pancreas.png',
  'GoutRisk':                   'Gout Risk.png',
  'Iron':                       'Iron.png',
  'Inflammation':               'inflammation.png',
  'Stress':                     'Stress.png',
  'PSA':                        'Prostate specific antigen.png',
  'FSH':                        'FSH – Follicular stimulating hormone.png',
  'LH':                         'LH – Luteinising Hormone.png',
  'Progesterone':               'Progesterone.png',
  'Prolactin':                  'Prolactin.png',
  'HbA1c':                      'HbA1c.png',
  'Magnesium':                  'Magnesium.png',
  'VitaminD':                   'Vitamin D.png',
  'DiabetesScreen':             'Diabetes Screen.png',
  'AMH':                        'AMH.png',
  'Vitalman':                   'Packages/Vitalman.png',
  'Vitalwoman':                 'Packages/Vitalwoman.png',
  'TiredAllTheTime':            'Packages/Tired all the time.png',
  'AchesAndPains':              'Packages/Aches & Pains.png',
  'MounjaroMonitoring':         'Packages/Mounjaro monitoring.png',
  'AbdominalPain':              'Packages/Abdominal Pain.png',
  'GeneralHealthScreen':        'Packages/General Health Screen.png',
  'WeightManagement':           'Packages/Weight management.png',
  'StressLess':                 'Packages/Stress Less.png',
  'TiredAllTheTimePlus':        'Packages/Tired All The Time Plus.png',
  'LifestyleScreen':            'Packages/Lifestyle screen.png',
  'FertilityPanel':             'Packages/Fertility Panel.png',
  'EliteHeart':                 'Packages/Elite Heart & Metabolic Profile.png',
  'GrowthHormone':              'Packages/Growth Hormone Level.png',
  'NeedleStick':                'Packages/Needle Stick Injury Screen.png',
  'IGF1':                       'Packages/Insulin Like Growth Factor.png',
  'UltimateHealth':             'Packages/Ultimatehealth.png',
  'TRT':                        'Packages/TRT.png',
  'BhCG':                       'Packages/B-HCG.png',
  'PregnancyProgress':          'Packages/Pregnancy Progress.png',
  'MenopauseProfile':           'Packages/Menopause Profile.png',
  'VitaminMinerals':            'Packages/Vitamin & Minerals.png',
  'NutritionalDigestiveHealth': 'Packages/Nutritional & Digestive Health.png',
  'DigestiveHealthProfile':     'Packages/Digestive Health Profile.png',
  'MuscleJointHealth':          'Packages/Muscle & Joint health.png',
  'PancreaticHealthProfile':    'Packages/Pancreatic health profile.png',
  'SpecialistDiabetesProfile':  'Packages/ Specialist Diabetes Status Profile.png',
}

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    slug: 'testosterone', title: 'Testosterone Levels Test', price: 29,
    biomarker_count: 1, category_tags: ['Best Seller', "Men's Health"], image_key: 'Testosterone',
    description: "Feeling tired, low on motivation, or noticing changes in muscle mass or mood? A quick testosterone test can help identify whether your levels are in check and guide you toward better hormonal health.",
  },
  {
    slug: 'thyroid', title: 'Thyroid Function Test', price: 49,
    biomarker_count: 2, category_tags: ['Hormones', 'Energy & Metabolism'], image_key: 'Thyroid',
    description: "If you've been feeling unusually tired, gaining or losing weight unexpectedly, experiencing mood changes, hair loss, or struggling with temperature regulation, your thyroid could be the cause. This test checks two key hormones — TSH and Free T4 — to give a clear picture of your thyroid health.",
  },
  {
    slug: 'complete-blood-count', title: 'Complete Blood Count (CBC)', price: 49,
    biomarker_count: 21, category_tags: ['General Health', 'Best Seller'], image_key: 'CompleteBloodCount',
    description: "A Complete Blood Count (CBC) checks your red and white blood cells and platelets. It helps spot signs of anaemia, infection and immune-related issues. If you're unusually tired, picking up frequent bugs or noticing easy bruising, a CBC can help uncover what's going on.",
  },
  {
    slug: 'liver-function-tests', title: 'Liver Function Tests', price: 39,
    biomarker_count: 8, category_tags: ['Same-Day Results', 'Liver Health'], image_key: 'LiverFunction',
    description: "Worried about how your habits might be impacting your liver? Whether it's regular drinking, carrying extra weight, or just wanting to take better care of your long-term health, checking in on your liver function is a smart step. Our Liver Function Test looks at key markers to detect early signs of stress or damage.",
  },
  {
    slug: 'lipid-profile', title: 'Lipid Profile', price: 39,
    biomarker_count: 6, category_tags: ['Heart Health'], image_key: 'LipidProfile',
    description: "Gain a deeper understanding of your heart health with lipid profile testing. This comprehensive assessment provides a detailed look at your cholesterol levels — including LDL, HDL, triglycerides, and more — to help identify your risk of heart disease.",
  },
  {
    slug: 'advanced-kidney-electrolyte-screen', title: 'Advanced Kidney & Electrolyte Screen', price: 79,
    biomarker_count: 11, category_tags: ['Kidney & Electrolytes'], image_key: 'AdvancedKidney',
    description: "Your kidneys do more than just filter waste — they help regulate essential minerals, control fluid balance, and keep your heart, muscles, and nerves functioning properly. Whether you're experiencing symptoms like fatigue, muscle cramps, or high blood pressure, this screen checks 11 key markers.",
  },
  {
    slug: 'kidney-function', title: 'Kidney Function', price: 39,
    biomarker_count: 3, category_tags: ['Same-Day Results', 'Kidney Health'], image_key: 'KidneyFunction',
    description: "If you've been feeling more tired than usual, experiencing swelling in your legs or ankles, or noticing changes in how often you urinate, it could be worth checking in on your kidney health. Our Kidney Function Blood Test measures key markers including creatinine, urea, and eGFR.",
  },
  {
    slug: 'pancreas-amylase', title: 'Pancreas (Amylase)', price: 49,
    biomarker_count: 1, category_tags: ['Pancreas'], image_key: 'Pancreas',
    description: "Amylase is a key enzyme made by your pancreas that helps break down carbohydrates during digestion. When the pancreas becomes irritated or inflamed, elevated amylase can be a sign of pancreatic stress. This test is especially relevant for those on Mounjaro or experiencing digestive discomfort.",
  },
  {
    slug: 'gout-risk', title: 'Gout Risk (Uric Acid)', price: 59,
    biomarker_count: 1, category_tags: ['Same-Day Results', 'Joint Health'], image_key: 'GoutRisk',
    description: "Uric acid is a natural waste product that forms when the body breaks down purines. When levels become too high, sharp crystals can build up in the joints, leading to gout — a painful and often sudden form of arthritis. If you've experienced swollen, hot joints this test can help.",
  },
  {
    slug: 'iron-ferritin', title: 'Iron (Ferritin)', price: 29,
    biomarker_count: 1, category_tags: ['Iron Status'], image_key: 'Iron',
    description: "If you're often feeling drained, lightheaded, or just not yourself, it could be a sign your iron levels are out of balance. Iron plays a vital role in transporting oxygen throughout your body, and when levels are too low or too high, it can leave you feeling fatigued, weak, or foggy.",
  },
  {
    slug: 'inflammation', title: 'Inflammation (hs-CRP)', price: 39,
    biomarker_count: 1, category_tags: ['Inflammation'], image_key: 'Inflammation',
    description: "Wondering if hidden inflammation could be impacting your health? Our High-Sensitivity CRP Blood Test measures c-reactive protein — a key marker of inflammation — to help identify whether chronic inflammation may be contributing to your symptoms or long-term health risks.",
  },
  {
    slug: 'stress-cortisol', title: 'Stress – Cortisol (9am)', price: 45,
    biomarker_count: 1, category_tags: ['Adrenal Health'], image_key: 'Stress',
    description: "Curious if your cortisol levels could be affecting how you feel? Cortisol is your body's main stress hormone, and when it's out of balance, it can lead to issues like fatigue, anxiety, sleep problems, or weight changes. Our 9am Cortisol Test is often the first step in assessing adrenal function.",
  },
  {
    slug: 'psa-prostate-specific-antigen', title: 'PSA – Prostate Specific Antigen', price: 45,
    biomarker_count: 1, category_tags: ['Prostate Health'], image_key: 'PSA',
    description: "Prostate cancer is one of the most common cancers in men, especially as they get older — but it often develops without obvious symptoms. Our PSA Blood Test measures prostate-specific antigen to help identify potential concerns early, when treatment is most effective.",
  },
  {
    slug: 'fsh', title: 'FSH – Follicular Stimulating Hormone', price: 45,
    biomarker_count: 1, category_tags: ['Hormones'], image_key: 'FSH',
    description: "FSH (Follicle-Stimulating Hormone) is essential for keeping your reproductive system in balance. In women, it helps regulate the menstrual cycle and supports the growth of eggs in the ovaries. In men, it plays a key role in sperm production. Testing FSH levels can provide important insights into fertility.",
  },
  {
    slug: 'lh-luteinising-hormone', title: 'LH – Luteinising Hormone', price: 39,
    biomarker_count: 1, category_tags: ['Hormones'], image_key: 'LH',
    description: "Struggling with irregular periods, fertility concerns, or hormonal symptoms? Our private LH Blood Test offers a clear window into your reproductive health. Luteinising Hormone (LH) plays a key role in ovulation in women and testosterone production in men.",
  },
  {
    slug: 'progesterone', title: 'Progesterone', price: 49,
    biomarker_count: 1, category_tags: ['Hormones'], image_key: 'Progesterone',
    description: "Wondering if your hormones are where they should be? Our private Progesterone Blood Test can help you better understand your cycle and fertility. Progesterone is a key hormone released after ovulation that helps prepare the body for pregnancy and supports a healthy menstrual cycle.",
  },
  {
    slug: 'prolactin', title: 'Prolactin', price: 39,
    biomarker_count: 1, category_tags: ['Hormones'], image_key: 'Prolactin',
    description: "Unexplained fatigue, low libido, irregular periods, or unexpected breast changes? These could be signs of abnormal prolactin levels. Prolactin is a hormone that also plays a role in hormonal balance for both sexes. In women, high prolactin can disrupt the menstrual cycle and affect fertility.",
  },
  {
    slug: 'hba1c', title: 'HbA1c (Diabetes)', price: 45,
    biomarker_count: 1, category_tags: ['Same-Day Results', 'Diabetes'], image_key: 'HbA1c',
    description: "If you're feeling unusually tired, gaining weight, experiencing constant thirst, or just want to stay on top of your health, our HbA1c Blood Test is a powerful way to check your risk of diabetes or prediabetes. Unlike a standard glucose test, HbA1c reflects your average blood sugar levels over the past 2–3 months.",
  },
  {
    slug: 'magnesium', title: 'Magnesium', price: 49,
    biomarker_count: 1, category_tags: ['Minerals'], image_key: 'Magnesium',
    description: "Feeling fatigued, experiencing muscle cramps, or struggling with low energy? Magnesium is a vital mineral that supports muscle function, nerve signalling, and heart health — yet low levels often go undetected. Our Magnesium Blood Test measures your serum magnesium levels to help identify deficiencies.",
  },
  {
    slug: 'vitamin-d', title: 'Vitamin D (25-OH)', price: 39,
    biomarker_count: 1, category_tags: ['Vitamins'], image_key: 'VitaminD',
    description: "Do you often feel tired, rundown, or struggle with muscle aches and pains? You could be low in vitamin D, especially if you spend little time outdoors, have darker skin, or are over 65. Vitamin D is essential not only for bone health but also immune function, mood, and muscle strength.",
  },
  {
    slug: 'diabetes-screen', title: 'Diabetes Screen', price: 59,
    biomarker_count: 2, category_tags: ['Diabetes', 'Metabolism'], image_key: 'DiabetesScreen',
    description: "If you're feeling unusually tired, gaining weight, experiencing constant thirst, or just want to stay on top of your health, our Diabetes Screen is a powerful way to check your risk of diabetes or prediabetes. This dual diabetes test includes random glucose & HbA1c which reflects your average blood sugar over the past 2–3 months.",
  },
  {
    slug: 'amh', title: 'AMH (Anti-Müllerian Hormone)', price: 79,
    biomarker_count: 1, category_tags: ['Fertility', "Women's Health"], image_key: 'AMH',
    description: "Wondering about your ovarian reserve or fertility potential? Our AMH Blood Test helps you understand how many eggs you have remaining — giving valuable insight into your reproductive health, fertility planning, and response to fertility treatments.",
  },
  {
    slug: 'vitalman-sameday-screen', title: 'VitalMan Same-Day Screen', price: 179,
    biomarker_count: 48, category_tags: ['Best Seller', "Men's Health"], image_key: 'Vitalman',
    description: "If you're serious about your health, VitalMan is the premium check-up designed to give you the full picture. This advanced blood test package goes far beyond the basics, covering everything from heart health and hormone balance to liver and kidney function, nutritional status, and inflammation markers.",
  },
  {
    slug: 'vitalwomen-sameday-screen', title: 'VitalWoman Same-Day Screen', price: 179,
    biomarker_count: 48, category_tags: ["Women's Health", 'Best Seller'], image_key: 'Vitalwoman',
    description: "VitalWoman is more than just a routine check — it's a full-spectrum health assessment for women who want to take charge of their wellbeing. This premium package explores everything from hormones and thyroid function to cardiovascular health, vitamins, minerals, kidney and liver performance, and more.",
  },
  {
    slug: 'tired-all-the-time', title: 'Tired All the Time', price: 149,
    biomarker_count: 38, category_tags: ['Best Seller', 'Energy & Fatigue'], image_key: 'TiredAllTheTime',
    description: "If you wake up feeling drained, rely on caffeine just to get through the day, or find yourself crashing by mid-afternoon — you're not alone. Persistent fatigue can creep into every part of life, affecting your mood, focus, motivation, and even relationships. This 38-biomarker panel uncovers the root cause.",
  },
  {
    slug: 'aches-and-pains', title: 'Aches & Pains', price: 119,
    biomarker_count: 35, category_tags: ['Best Seller', 'Joint Health'], image_key: 'AchesAndPains',
    description: "Whether it's nagging joint pain, unexplained muscle soreness, or that constant feeling of stiffness that won't go away — this panel digs into the underlying causes. Covering inflammation, gout risk, vitamin and mineral deficiencies, hormones, and organ health, it helps find why your body is hurting.",
  },
  {
    slug: 'mounjaro-monitoring', title: 'Mounjaro Monitoring', price: 129,
    biomarker_count: 42, category_tags: ['Best Seller', 'Metabolic Health'], image_key: 'MounjaroMonitoring',
    description: "If you're using Mounjaro (tirzepatide) for weight management or type 2 diabetes, keeping an eye on your internal health is just as important as what the scales say. This tailored blood test package is designed to help you monitor key areas that may be affected during treatment.",
  },
  {
    slug: 'abdominal-pain', title: 'Abdominal Pain', price: 109,
    biomarker_count: 34, category_tags: ['Best Seller', 'Digestive Health'], image_key: 'AbdominalPain',
    description: "Bloating, cramping, or persistent abdominal pain can be worrying — especially when symptoms keep returning without a clear cause. Digestive discomfort can stem from a wide range of underlying issues, from inflammation and infection to problems with your liver, kidneys, or pancreas.",
  },
  {
    slug: 'general-health-screen', title: 'General Health Screen', price: 99,
    biomarker_count: 40, category_tags: ['General Health', 'Same-Day Results'], image_key: 'GeneralHealthScreen',
    description: "Not feeling quite yourself lately? Whether you're dealing with vague symptoms like low energy, poor sleep, or just want to stay on top of your health, this core check-up offers insight where it matters most. The General Health Screen assesses the key systems that keep your body running efficiently.",
  },
  {
    slug: 'weight-management', title: 'Weight Management Test', price: 129,
    biomarker_count: 16, category_tags: ['Best Seller', 'Metabolism'], image_key: 'WeightManagement',
    description: "Struggling with weight gain or finding it difficult to lose weight despite your best efforts? It's not always about willpower — hormones, stress, nutrient levels, and organ function can all play a role in how your body stores and burns fat. The Weight Management Test uncovers the hidden factors.",
  },
  {
    slug: 'stress-less', title: 'Stress Less', price: 79,
    biomarker_count: 3, category_tags: ['General Health', 'Stress & Energy'], image_key: 'StressLess',
    description: "Stress doesn't just affect your mind — it can change how your body works. High cortisol, thyroid changes, or unstable blood sugar can all contribute to fatigue, stubborn weight gain, poor sleep, and mood swings. This test checks those hidden markers to show you if stress is tipping your system out of balance.",
  },
  {
    slug: 'tired-all-the-time-plus', title: 'Tired All the Time (Plus)', price: 199,
    biomarker_count: 45, category_tags: ['Energy', 'Fatigue', 'Metabolism'], image_key: 'TiredAllTheTimePlus',
    description: "Sometimes tiredness goes beyond stress or lifestyle. If you've tried sleeping more, eating better, or cutting back on caffeine but still wake up exhausted, your body may be sending stronger signals. This 45-biomarker extended panel goes deeper to find what simpler tests might miss.",
  },
  {
    slug: 'lifestyle-screen', title: 'Lifestyle Screen', price: 129,
    biomarker_count: 43, category_tags: ['General Health', 'Wellbeing', 'Preventive'], image_key: 'LifestyleScreen',
    description: "Your health is more than the absence of illness — it's about understanding what's happening inside your body, even when you feel fine. The Lifestyle Screen is a comprehensive blood test package designed to give you a 360° view of your wellbeing, from energy and immune function to heart, liver, and hormonal health.",
  },
  {
    slug: 'fertility-panel', title: 'Fertility Panel', price: 219,
    biomarker_count: 56, category_tags: ['Fertility', 'Hormones'], image_key: 'FertilityPanel',
    description: "Your hormones tell a powerful story about your fertility, cycle, and overall reproductive wellbeing. Whether you're actively trying to conceive, planning for the future, or investigating symptoms like irregular periods, low libido, or unexplained fatigue, our Fertility Screen offers a comprehensive assessment.",
  },
  {
    slug: 'elite-heart-metabolic', title: 'Elite Heart & Metabolic Health Profile', price: 350,
    biomarker_count: 82, category_tags: ['Elite', 'Heart & Metabolic'], image_key: 'EliteHeart',
    description: "Our most advanced and exclusive blood test, this package is designed to provide a comprehensive overview of cardiovascular, metabolic, hormonal, and immune health. With 82 biomarkers, it covers cholesterol and apolipoproteins, inflammation, glucose metabolism, kidney and liver function, and much more.",
  },
  {
    slug: 'growth-hormone-level', title: 'Growth Hormone Level', price: 99,
    biomarker_count: 1, category_tags: ['Hormones'], image_key: 'GrowthHormone',
    description: "Reignite your body's natural vitality. Growth hormone, often called the 'youth hormone,' isn't just for growing children — adults continue to produce it every day to support energy, lean muscle, healthy fat metabolism, and recovery. This test helps you understand whether your GH levels are working for you.",
  },
  {
    slug: 'needle-stick-injury-screen', title: 'Needle Stick Injury Screen', price: 99,
    biomarker_count: 3, category_tags: ['Infectious Diseases'], image_key: 'NeedleStick',
    description: "Accidental needle stick injuries can be stressful — whether from medical work, personal care, or another unexpected exposure. This quick and reliable screen checks for three of the most important blood-borne infections: HIV 1, Hepatitis B surface antigen, and Hepatitis C antibodies.",
  },
  {
    slug: 'igf-1-test', title: 'IGF-1 (Insulin-like Growth Factor 1) Test', price: 149,
    biomarker_count: 1, category_tags: ['Hormones'], image_key: 'IGF1',
    description: "IGF-1 is one of the most reliable ways to understand how your body's growth hormone system is functioning. Unlike growth hormone itself, which fluctuates throughout the day, IGF-1 levels remain steady, giving a clearer picture of your long-term balance. IGF-1 supports energy, lean muscle, and bone strength.",
  },
  {
    slug: 'vitalman-advanced-screen', title: 'VitalMan Advanced Screen', price: 179,
    biomarker_count: 50, category_tags: ['Best Seller', "Men's Health"], image_key: 'Vitalman',
    description: "If you're serious about your health, VitalMan Advanced is the premium check-up designed to give you the full picture. This advanced blood test package goes far beyond the basics, covering everything from heart health and hormone balance to liver and kidney function, nutritional status, and inflammation markers.",
  },
  {
    slug: 'vitalwoman-advanced-screen', title: 'VitalWoman Advanced Screen', price: 179,
    biomarker_count: 52, category_tags: ['Best Seller', "Women's Health"], image_key: 'Vitalwoman',
    description: "If you're serious about your health, VitalWoman Advanced is the premium check-up designed to give you the full picture. This advanced blood test package goes far beyond the basics, covering everything from heart health and hormone balance to liver and kidney function, nutritional status, and more.",
  },
  {
    slug: 'ultimate-vitality', title: 'Ultimate Vitality', price: 250,
    biomarker_count: 60, category_tags: ['Full Body', 'Advanced'], image_key: 'UltimateHealth',
    description: "The ultimate balance between depth and detail — for those serious about their health. The Ultimate Vitality package bridges the gap between lifestyle insight and advanced medical screening, giving you a comprehensive view of your health without going to a hospital.",
  },
  {
    slug: 'trt-health-screen', title: 'TRT Health Screen', price: 159,
    biomarker_count: 47, category_tags: ["Men's Health", 'Hormones'], image_key: 'TRT',
    description: "Your ultimate hormone health check — clarity, balance, and confidence. When you're on testosterone therapy — or thinking about starting — it's important to see the bigger picture, not just your testosterone number. This screen explores how your hormones, organs, and metabolic markers are all responding.",
  },
  {
    slug: 'b-hcg-blood-test', title: 'B-hCG Blood Test', price: 59,
    biomarker_count: 1, category_tags: ['Pregnancy', 'Fertility', "Women's Health"], image_key: 'BhCG',
    description: "The B-hCG (Beta-Human Chorionic Gonadotropin) Blood Test is a reliable way to check for pregnancy and monitor certain health conditions. B-hCG is a hormone produced during pregnancy, and measuring its levels in the blood provides fast and accurate insights.",
  },
  {
    slug: 'pregnancy-progress', title: 'Pregnancy Progress', price: 69,
    biomarker_count: 2, category_tags: ['Pregnancy', 'Fertility', "Women's Health"], image_key: 'PregnancyProgress',
    description: "Are you looking to track and reassure the progress of your pregnancy in its early stages? Our Pregnancy Progress Blood Test combines B-hCG and Progesterone — two essential hormones that help confirm pregnancy and monitor its healthy development.",
  },
  {
    slug: 'menopause-profile', title: 'Menopause Profile', price: 79,
    biomarker_count: 5, category_tags: ["Women's Health", 'Hormones', 'Menopause'], image_key: 'MenopauseProfile',
    description: "Experiencing changes in your cycle, hot flushes, mood swings, or difficulty sleeping? Our Menopause Profile helps assess your hormonal balance and provides clarity on whether you may be approaching or going through menopause.",
  },
  {
    slug: 'vitamins-minerals-screen', title: 'Vitamins & Minerals Screen', price: 99,
    biomarker_count: 12, category_tags: ['Nutrition', 'General Health', 'Vitamins'], image_key: 'VitaminMinerals',
    description: "Feeling tired, low in energy, prone to infections, or noticing changes in skin, hair, and nails? Our Vitamins & Minerals Screen is designed to assess your nutritional health and identify key deficiencies that may be affecting your wellbeing.",
  },
  {
    slug: 'nutritional-digestive-health', title: 'Nutritional & Digestive Health', price: 199,
    biomarker_count: 40, category_tags: ['Nutrition', 'Digestive Health', 'Wellness'], image_key: 'NutritionalDigestiveHealth',
    description: "Optimise your health from the inside out — because digestion and nutrients drive so much more than you think. This test combines nutritional screening with digestive health markers to give you a comprehensive picture of how well your body absorbs and uses key nutrients.",
  },
  {
    slug: 'digestive-health-profile', title: 'Digestive Health Profile', price: 99,
    biomarker_count: 3, category_tags: ['Digestive Health', 'Immune Health'], image_key: 'DigestiveHealthProfile',
    description: "If you're experiencing bloating, indigestion, irregular bowel habits, iron-deficiency, fatigue, skin issues or suspect food intolerance, our Digestive Health Profile offers targeted insight into key digestive-immune markers. This test helps screen for common gut-related immune triggers and infections.",
  },
  {
    slug: 'muscle-joint-health-profile', title: 'Muscle & Joint Health Profile', price: 99,
    biomarker_count: 3, category_tags: ['Muscle Health', 'Joint Health', 'Sports Health'], image_key: 'MuscleJointHealth',
    description: "If you're dealing with muscle pain, aches, stiffness, frequent cramps, joint swelling or reduced mobility, our Muscle & Joint Health Profile provides targeted insight. It checks key markers associated with muscle damage, uric acid build-up, and inflammatory activity.",
  },
  {
    slug: 'pancreatic-health-profile', title: 'Pancreatic Health Profile', price: 109,
    biomarker_count: 2, category_tags: ['Digestive Health', 'Pancreatic Health'], image_key: 'PancreaticHealthProfile',
    description: "If you're experiencing digestive discomfort, unexplained weight change, persistent fatigue, abdominal pain or altered bowel habits, our Pancreatic Health Profile provides insight into key pancreatic enzyme activity. This test helps assess how well your pancreas is functioning.",
  },
  {
    slug: 'specialist-diabetes-profile', title: 'Specialist Diabetes Profile', price: 149,
    biomarker_count: 5, category_tags: ['Diabetes', 'Metabolic Health', 'General Health'], image_key: 'SpecialistDiabetesProfile',
    description: "Whether you're at risk of diabetes, managing symptoms like fatigue or excessive thirst, or simply want a clear picture of your metabolic health, this test provides a comprehensive assessment of how your body produces and uses insulin. It helps identify insulin resistance, prediabetes, and diabetes early.",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function uploadImage(imageKey) {
  const relPath = IMAGE_FILES[imageKey]
  if (!relPath) { console.warn(`  [WARN] No path for key: ${imageKey}`); return null }
  const fullPath = path.join(IMAGES_BASE, relPath)
  if (!fs.existsSync(fullPath)) { console.warn(`  [WARN] Not found: ${fullPath}`); return null }
  const buffer = fs.readFileSync(fullPath)
  const file   = new File([buffer], path.basename(fullPath), { type: 'image/png' })
  const result = await utapi.uploadFiles(file)
  if (result.error) { console.warn(`  [WARN] Upload error for ${imageKey}: ${result.error.message}`); return null }
  return result.data.ufsUrl || result.data.url
}

async function main() {
  console.log('\n=== AiwasLabs Product Migration ===\n')

  // ── Phase 1: Upload unique images ──────────────────────────────────────────
  const uploadedUrls  = {}
  const uniqueKeys    = [...new Set(PRODUCTS.map(p => p.image_key))]
  console.log(`Phase 1: Uploading ${uniqueKeys.length} unique images to UploadThing...\n`)
  for (const key of uniqueKeys) {
    process.stdout.write(`  Uploading ${key}... `)
    uploadedUrls[key] = await uploadImage(key)
    console.log(uploadedUrls[key] ? `OK` : 'SKIPPED')
  }

  // ── Phase 2: Insert products ───────────────────────────────────────────────
  console.log(`\nPhase 2: Inserting ${PRODUCTS.length} products...\n`)
  let inserted = 0
  const insertedIds = {}

  for (const p of PRODUCTS) {
    const imageUrl = uploadedUrls[p.image_key]
    const images   = imageUrl ? JSON.stringify([imageUrl]) : '[]'

    try {
      const res = await pool.query(
        `INSERT INTO products
           (title, slug, description, price, biomarker_count, images, category_tags, product_type)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, 'booking')
         ON CONFLICT (slug) DO UPDATE
           SET title = EXCLUDED.title,
               description = EXCLUDED.description,
               price = EXCLUDED.price,
               biomarker_count = EXCLUDED.biomarker_count,
               images = EXCLUDED.images,
               category_tags = EXCLUDED.category_tags
         RETURNING id`,
        [p.title, p.slug, p.description, p.price, p.biomarker_count, images, p.category_tags]
      )
      insertedIds[p.slug] = res.rows[0].id
      console.log(`  ✓ ${p.slug}`)
      inserted++
    } catch (err) {
      console.error(`  ✗ ${p.slug}: ${err.message}`)
    }
  }

  // ── Phase 3: Insert test_info ──────────────────────────────────────────────
  console.log(`\nPhase 3: Inserting test_info for ${Object.keys(insertedIds).length} products...\n`)
  let testInfoCount = 0

  for (const [slug, productId] of Object.entries(insertedIds)) {
    const extracted = extractedData[slug]
    if (!extracted?.test_info) {
      console.log(`  - ${slug}: no test_info`)
      continue
    }
    try {
      await pool.query(
        `UPDATE products SET test_info = $1 WHERE id = $2`,
        [JSON.stringify(extracted.test_info), productId]
      )
      console.log(`  ✓ ${slug}`)
      testInfoCount++
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`)
    }
  }

  // ── Phase 4: Insert FAQs ───────────────────────────────────────────────────
  console.log(`\nPhase 4: Inserting FAQs...\n`)
  let faqCount = 0

  for (const [slug, productId] of Object.entries(insertedIds)) {
    const extracted = extractedData[slug]
    const faqs = extracted?.faqs ?? []
    if (faqs.length === 0) { console.log(`  - ${slug}: no FAQs`); continue }

    // Delete existing FAQs for this product (idempotent)
    await pool.query(`DELETE FROM faqs WHERE product_id = $1`, [productId])

    for (let i = 0; i < faqs.length; i++) {
      const faq = faqs[i]
      try {
        await pool.query(
          `INSERT INTO faqs (product_id, question, answer, sort_order) VALUES ($1, $2, $3, $4)`,
          [productId, faq.q, faq.a, i]
        )
        faqCount++
      } catch (err) {
        console.error(`  ✗ FAQ for ${slug}[${i}]: ${err.message}`)
      }
    }
    console.log(`  ✓ ${slug}: ${faqs.length} FAQs`)
  }

  console.log(`
=== Migration Complete ===
  Products inserted/updated : ${inserted}
  test_info populated        : ${testInfoCount}
  FAQ rows inserted          : ${faqCount}
`)
  await pool.end()
}

main().catch(err => {
  console.error(err)
  pool.end()
  process.exit(1)
})
