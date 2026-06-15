const MAP: Record<string, string> = {
  // Diabetes Screen
  'Hb A1c (mmol/mol)':'Diabetes Screen','HbA1c':'Diabetes Screen','Hb A1c':'Diabetes Screen',
  'Haemoglobin A1c':'Diabetes Screen','Glycated Haemoglobin':'Diabetes Screen','Glycated Hemoglobin':'Diabetes Screen',
  'Glucose':'Diabetes Screen','Blood glucose':'Diabetes Screen','Fasting Glucose':'Diabetes Screen',
  'Random Glucose':'Diabetes Screen','2hr OGTT':'Diabetes Screen','Insulin':'Diabetes Screen',
  'Insulin Levels':'Diabetes Screen','C Peptide':'Diabetes Screen','C-Peptide':'Diabetes Screen',
  'C Peptide (C-peptide)':'Diabetes Screen','Homa-IR':'Diabetes Screen','Homa IR':'Diabetes Screen','HOMA_IR':'Diabetes Screen',

  // Cholesterol Profile
  'Cholesterol':'Cholesterol Profile','Total Cholesterol':'Cholesterol Profile','Triglyceride':'Cholesterol Profile',
  'Triglycerides':'Cholesterol Profile','HDL':'Cholesterol Profile','HDL Cholesterol':'Cholesterol Profile',
  'HDL-C':'Cholesterol Profile','HDL % of total':'Cholesterol Profile','HDL - C Percentage of Total':'Cholesterol Profile',
  'LDL':'Cholesterol Profile','LDL Cholesterol':'Cholesterol Profile','LDL-C':'Cholesterol Profile',
  'Non-HDL':'Cholesterol Profile','Non HDL Cholesterol':'Cholesterol Profile',
  'TC/HDL Ratio':'Cholesterol Profile','Total Cholesterol:HDL Ratio':'Cholesterol Profile',

  // Extended Cholesterol Profile
  'Apolipoprotein A1':'Extended Cholesterol Profile','ApoA1':'Extended Cholesterol Profile',
  'Apolipoprotein B':'Extended Cholesterol Profile','APolipoprotein B':'Extended Cholesterol Profile',
  'ApoB':'Extended Cholesterol Profile','AP0 B/A1 Ratio':'Extended Cholesterol Profile',
  'APO B/A1 Ratio':'Extended Cholesterol Profile','ApoB/ApoA1':'Extended Cholesterol Profile',
  'ApoA1 Ratio':'Extended Cholesterol Profile','Lipoprotein A':'Extended Cholesterol Profile',
  'Lipoprotein(a)':'Extended Cholesterol Profile','Lipoprotein (a)':'Extended Cholesterol Profile',
  'Lp(a)':'Extended Cholesterol Profile','VLDL':'Extended Cholesterol Profile',
  'Very Low-Density Lipoprotein Calculated':'Extended Cholesterol Profile',

  // Full Blood Count
  'Haemoglobin':'Full Blood Count','Hb':'Full Blood Count','Haemoglobin (Hb)':'Full Blood Count',
  'Hct':'Full Blood Count','HCT':'Full Blood Count','Hematocrit':'Full Blood Count',
  'Red Blood Count':'Full Blood Count','Red Cell Count':'Full Blood Count','RBC':'Full Blood Count',
  'MCV':'Full Blood Count','MCH':'Full Blood Count','MCHC':'Full Blood Count','RDW':'Full Blood Count',
  'Platelets':'Full Blood Count','PLT':'Full Blood Count','MPV':'Full Blood Count',
  'WCC':'Full Blood Count','WBC':'Full Blood Count','White cell count':'Full Blood Count','White Cell Count':'Full Blood Count',
  'Neutrophils':'Full Blood Count','Neutrophil Count':'Full Blood Count',
  'Lymphocytes':'Full Blood Count','Lymphocyte Count':'Full Blood Count',
  'Monocytes':'Full Blood Count','Monocyte Count':'Full Blood Count',
  'Eosinophils':'Full Blood Count','Eosinophil Count':'Full Blood Count',
  'Basophils':'Full Blood Count','Basophil Count':'Full Blood Count',

  // Thyroid Function
  'TSH':'Thyroid Function','Thyroid Stimulating Hormone':'Thyroid Function',
  'Free T3':'Thyroid Function','FT3':'Thyroid Function','fT3':'Thyroid Function',
  'Free T4':'Thyroid Function','FT4':'Thyroid Function','fT4':'Thyroid Function',
  'Free Thyroxine':'Thyroid Function','Total Thyroxine':'Thyroid Function','Total T4':'Thyroid Function',
  'Thyroid Peroxidase Antibody':'Thyroid Function','TPOAb':'Thyroid Function',
  'Thyroglobulin Antibody':'Thyroid Function','TgAb':'Thyroid Function',
  'Thyroid Stim. Hormone':'Thyroid Function','Thyroglobulin Antibodies':'Thyroid Function',
  'Thyroid Peroxidase Antibodies':'Thyroid Function',

  // Kidney Function
  'Urea':'Kidney Function','BUN':'Kidney Function','Creatinine':'Kidney Function',
  'estimated GFR':'Kidney Function','Estimated Glomerular Filtration Rate':'Kidney Function',
  'Estimated GFR':'Kidney Function','eGFR':'Kidney Function',

  // Minerals & Electrolytes
  'Sodium':'Minerals & Electrolytes','Potassium':'Minerals & Electrolytes','Chloride':'Minerals & Electrolytes',
  'Chloride (Cl-)':'Minerals & Electrolytes','Bicarbonate':'Minerals & Electrolytes',
  'Bicarbonate (HCO3-)':'Minerals & Electrolytes','Calcium':'Minerals & Electrolytes',
  'Corrected Calcium':'Minerals & Electrolytes','Phosphate':'Minerals & Electrolytes',
  'Phosphorus':'Minerals & Electrolytes','Magnesium':'Minerals & Electrolytes','Zinc':'Minerals & Electrolytes',

  // Liver Profile & Proteins
  'Total Protein':'Liver Profile & Proteins','Total protein':'Liver Profile & Proteins',
  'Albumin':'Liver Profile & Proteins','Globulin':'Liver Profile & Proteins','Globulins':'Liver Profile & Proteins',
  'ALT':'Liver Profile & Proteins','ALT/GPT':'Liver Profile & Proteins','Alanine Transaminase':'Liver Profile & Proteins',
  'AST':'Liver Profile & Proteins','AST/GOT':'Liver Profile & Proteins','Aspartate Transaminase':'Liver Profile & Proteins',
  'ALP':'Liver Profile & Proteins','Alkaline phosphatase':'Liver Profile & Proteins','Alkaline Phosphatase':'Liver Profile & Proteins',
  'GGT':'Liver Profile & Proteins','Gamma GT':'Liver Profile & Proteins',
  'Bilirubin':'Liver Profile & Proteins','Total Bilirubin':'Liver Profile & Proteins',
  'Asparate Transferase**':'Liver Profile & Proteins','Alanine Transferase':'Liver Profile & Proteins',
  'Aspartate Transferase **':'Liver Profile & Proteins',

  // Iron Studies
  'Ferritin':'Iron Studies','Serum Iron':'Iron Studies','Iron':'Iron Studies',
  'TIBC':'Iron Studies','UIBC':'Iron Studies','Iron Binding Capacity':'Iron Studies',
  'Transferrin':'Iron Studies','Transferrin Saturation':'Iron Studies',
  'Transferrin saturation':'Iron Studies','Transferin Saturation':'Iron Studies',

  // Cardiac Muscle & Joint Health
  'Uric Acid':'Cardiac Muscle & Joint Health','Uricacid':'Cardiac Muscle & Joint Health',
  'Creatine Kinase':'Cardiac Muscle & Joint Health','Creatine-Kinase':'Cardiac Muscle & Joint Health',
  'CK':'Cardiac Muscle & Joint Health','CK-MB':'Cardiac Muscle & Joint Health','CKMB':'Cardiac Muscle & Joint Health',
  'Myoglobin':'Cardiac Muscle & Joint Health',

  // Pancreatic Health
  'Amylase':'Pancreatic Health','Lipase':'Pancreatic Health',

  // Vitamin Status
  'Vitamin D':'Vitamin Status','Vitamin D 25(OH)':'Vitamin Status','25(OH)D':'Vitamin Status',
  'Folate':'Vitamin Status','Serum Folate (Vitamin B9)':'Vitamin Status',
  'Vitamin B12':'Vitamin Status','Total Antioxidant Status':'Vitamin Status',
  'Total Antioxidant Activity':'Vitamin Status','TAS':'Vitamin Status',
  'Active B12':'Vitamin Status','Total Vit B12':'Vitamin Status',

  // Digestive Health
  'H. pylori':'Digestive Health','H Pylori':'Digestive Health',
  'Helicobacter pylori IgG':'Digestive Health','Tissue Transglutaminase IgA':'Digestive Health',
  'Anti-Tissue Transglutaminase Antibodies':'Digestive Health','Anti-TTG IgA':'Digestive Health',
  'IgA':'Digestive Health',

  // Stress & Energy Hormones
  'Cortisol':'Stress & Energy Hormones','DHEA':'Stress & Energy Hormones',
  'DHEA-S':'Stress & Energy Hormones','D H E A Sulphate':'Stress & Energy Hormones',
  'HE A Sulfate':'Stress & Energy Hormones',

  // Hormones (Sex & Reproductive)
  'Testosterone':'Hormones (Sex & Reproductive)','Total Testosterone':'Hormones (Sex & Reproductive)',
  'Free Testosterone':'Hormones (Sex & Reproductive)','Free Androgen Index':'Hormones (Sex & Reproductive)',
  'FAI':'Hormones (Sex & Reproductive)','SHBG':'Hormones (Sex & Reproductive)',
  'Sex Hormone Binding Globulin':'Hormones (Sex & Reproductive)','Oestradiol':'Hormones (Sex & Reproductive)',
  'Oestradiol (E2)':'Hormones (Sex & Reproductive)','Estradiol':'Hormones (Sex & Reproductive)',
  'E2':'Hormones (Sex & Reproductive)','FSH':'Hormones (Sex & Reproductive)',
  'Follicle Stimulating Hormone':'Hormones (Sex & Reproductive)','LH':'Hormones (Sex & Reproductive)',
  'Luteinising Hormone':'Hormones (Sex & Reproductive)','Prolactin':'Hormones (Sex & Reproductive)',
  'Progesterone':'Hormones (Sex & Reproductive)','Follicle Stim. Hormone':'Hormones (Sex & Reproductive)',

  // Inflammatory Markers
  'CRP':'Inflammatory Markers','C Reactive Protein':'Inflammatory Markers',
  'HS-CRP':'Inflammatory Markers','High Sensitivity CRP':'Inflammatory Markers',

  // Prostate-specific Antigen
  'PSA':'Prostate-specific Antigen','Prostatic Specific Antigen':'Prostate-specific Antigen',
  'Prostate Specific Antigen':'Prostate-specific Antigen',

  // Cancer Markers
  'CA-125':'Cancer Markers','CA125':'Cancer Markers','Cancer Antigen 125':'Cancer Markers',
}

export function getCategoryForBiomarker(name: string): string {
  const clean = name.trim()
  if (MAP[clean]) return MAP[clean]
  const cleanLower = clean.toLowerCase()
  for (const [key, cat] of Object.entries(MAP)) {
    const kl = key.toLowerCase()
    if (cleanLower.includes(kl) || kl.includes(cleanLower)) return cat
  }
  return 'Other Tests'
}

export interface BiomarkerRow {
  name: string
  value: string | null
  unit: string | null
  reference_range: string | null
  flag: string | null
}

export interface Category {
  name: string
  rows: BiomarkerRow[]
}

export function groupByCategory(biomarkers: BiomarkerRow[]): Category[] {
  const map: Record<string, BiomarkerRow[]> = {}
  for (const b of biomarkers) {
    if (!b.name.trim()) continue
    const cat = getCategoryForBiomarker(b.name)
    if (!map[cat]) map[cat] = []
    map[cat].push(b)
  }
  return Object.entries(map).map(([name, rows]) => ({ name, rows }))
}
