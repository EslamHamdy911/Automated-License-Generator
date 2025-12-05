import React, { useState, useEffect } from 'react';
import { ProjectType, LicenseType, FormData, GeneratedDocs } from './types';
import { generateDocs } from './services/geminiService';

// Translations
const translations = {
  ar: {
    appTitle: "رخصة عربية مؤتمتة",
    btnApk: "تحميل APK",
    tutorialTitle: "أهلاً بك في رخصة عربية مؤتمتة",
    visionTitle: "رؤية التطبيق",
    visionText: "تمكين المطورين وصناع المحتوى من حماية حقوقهم الفكرية ونشر المعرفة بسهولة من خلال توليد وثائق قانونية دقيقة ومؤتمتة.",
    usageTitle: "كيفية الاستخدام:",
    steps: [
      "أدخل <strong>اسم المشروع</strong> واسم <strong>المؤلف</strong>.",
      "اختر <strong>نوع الرخصة</strong> المناسبة (MIT أو CC BY-SA).",
      "اكتب وصفاً موجزاً للمشروع ليتم تضمينه في ملف README.",
      "اضغط على <strong>توليد الملفات</strong> وانتظر قليلاً.",
      "انسخ النصوص المولدة واستخدمها في مشروعك مباشرة!"
    ],
    btnGotIt: "فهمت، لنبدأ!",
    formTitle: "بيانات المشروع",
    formSubtitle: "أدخل تفاصيل مشروعك لنقوم بتوليد الوثائق القانونية المناسبة.",
    lblProjectName: "اسم المشروع",
    phProjectName: "مثال: منصة التعليم المفتوح",
    lblAuthor: "اسم المؤلف / المالك",
    phAuthor: "مثال: أحمد محمد",
    lblLicense: "نوع الرخصة",
    lblProjectType: "نوع المشروع",
    optOpenSource: "مفتوح المصدر (Open Source)",
    optExperimental: "تجريبي (Experimental)",
    optCommercial: "تجاري (Commercial)",
    lblDesc: "وصف مختصر",
    phDesc: "اشرح ما يفعله مشروعك بإيجاز...",
    btnGenerate: "توليد الملفات",
    btnGenerating: "جاري التوليد...",
    errApiKey: "مفتاح API غير متوفر. يرجى إعداد بيئة العمل.",
    errGen: "حدث خطأ أثناء توليد الملفات. يرجى المحاولة مرة أخرى.",
    mitInfo: "رخصة <strong>MIT License</strong>: رخصة قصيرة وبسيطة ومتساهلة. تسمح للأشخاص بفعل أي شيء برمزك طالما أنهم يقدمون الإسناد إليك ولا يحملونك المسؤولية.",
    ccInfo: "رخصة <strong>CC BY-SA 4.0</strong>: تسمح للآخرين بالمشاركة والتعديل حتى للأغراض التجارية، طالما أنهم ينسبون العمل لك ويرخصون أعمالهم المشتقة تحت نفس الشروط.",
    emptyTitle: "النتائج ستظهر هنا",
    emptyText: "املأ النموذج واضغط على زر التوليد لإنشاء ملفاتك.",
    copy: "نسخ النص",
    copied: "تم النسخ!",
    btnDownload: "تحميل الملف",
    apkAlert: "جارٍ تجهيز ملف APK... ستتوفر النسخة قريباً!",
    footer: "تم التطوير بواسطة © 2025 Islam Hamdy – Nakamoko Systems"
  },
  en: {
    appTitle: "Automated License Generator",
    btnApk: "Download APK",
    tutorialTitle: "Welcome to Automated License Generator",
    visionTitle: "App Vision",
    visionText: "Empowering developers and creators to protect their IP and share knowledge easily by generating accurate, automated legal documents.",
    usageTitle: "How to Use:",
    steps: [
      "Enter <strong>Project Name</strong> and <strong>Author Name</strong>.",
      "Select the appropriate <strong>License Type</strong> (MIT or CC BY-SA).",
      "Write a brief description to be included in the README.",
      "Click <strong>Generate Files</strong> and wait a moment.",
      "Copy the generated text and use it directly in your project!"
    ],
    btnGotIt: "Got it, Let's Start!",
    formTitle: "Project Details",
    formSubtitle: "Enter your project details to generate the appropriate legal documents.",
    lblProjectName: "Project Name",
    phProjectName: "Ex: Open Education Platform",
    lblAuthor: "Author / Owner Name",
    phAuthor: "Ex: John Doe",
    lblLicense: "License Type",
    lblProjectType: "Project Type",
    optOpenSource: "Open Source",
    optExperimental: "Experimental",
    optCommercial: "Commercial",
    lblDesc: "Short Description",
    phDesc: "Briefly explain what your project does...",
    btnGenerate: "Generate Files",
    btnGenerating: "Generating...",
    errApiKey: "API Key is missing. Please set up the environment.",
    errGen: "An error occurred while generating files. Please try again.",
    mitInfo: "<strong>MIT License</strong>: A short, simple, and permissive license. It lets people do anything with your code as long as they provide attribution and don't hold you liable.",
    ccInfo: "<strong>CC BY-SA 4.0</strong>: Allows others to share and adapt, even for commercial purposes, as long as they credit you and license their new creations under the identical terms.",
    emptyTitle: "Results will appear here",
    emptyText: "Fill the form and click Generate to create your files.",
    copy: "Copy Text",
    copied: "Copied!",
    btnDownload: "Download File",
    apkAlert: "Preparing APK file... Version coming soon!",
    footer: "Developed by © 2025 Islam Hamdy – Nakamoko Systems"
  }
};

type Language = 'ar' | 'en';

// Icons
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H10.875c-.621 0-1.125.504-1.125 1.125v3.375m9.75 12.375a9.06 9.06 0 001.5-.124m-9-9.06A9.06 9.06 0 0116.5 6.375" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const LanguageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

// Tutorial Modal Component
const TutorialModal = ({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: Language }) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <HelpIcon />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.tutorialTitle}</h2>
          </div>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.visionTitle}</h3>
              <p>{t.visionText}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.usageTitle}</h3>
              <ul className="list-disc list-inside space-y-2 marker:text-green-500">
                {t.steps.map((step, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-slate-900/50 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {t.btnGotIt}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const [formData, setFormData] = useState<FormData>({
    projectName: 'Nakamoko Systems',
    projectDescription: 'Automated digital platforms for startups and communities.',
    projectType: ProjectType.OPEN_SOURCE,
    licenseType: LicenseType.MIT,
    authorName: 'Islam Hamdy – Nakamoko Systems',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedDocs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'license' | 'readme'>('license');
  const [copied, setCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const t = translations[language];

  useEffect(() => {
    // Check if it's the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowTutorial(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.API_KEY) {
        setError(t.errApiKey);
        return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const docs = await generateDocs(formData);
      setResult(docs);
    } catch (err) {
      setError(t.errGen);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const content = activeTab === 'license' ? result.licenseContent : result.readmeContent;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const content = activeTab === 'license' ? result.licenseContent : result.readmeContent;
    const filename = activeTab === 'license' ? 'LICENSE' : 'README.md';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadApk = () => {
    alert(t.apkAlert);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} lang={language} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {language === 'ar' ? 'ر' : 'L'}
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 hidden sm:block">
                {t.appTitle}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadApk}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <DownloadIcon />
                <span>{t.btnApk}</span>
              </button>

              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Help"
              >
                <HelpIcon />
              </button>

              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300 flex items-center gap-1 font-bold text-sm"
                aria-label="Toggle Language"
              >
                <LanguageIcon />
                <span className="uppercase">{language === 'ar' ? 'EN' : 'ع'}</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.formTitle}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t.formSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.lblProjectName}</label>
                    <input
                      type="text"
                      id="projectName"
                      name="projectName"
                      required
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder={t.phProjectName}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.lblAuthor}</label>
                    <input
                      type="text"
                      id="authorName"
                      name="authorName"
                      required
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder={t.phAuthor}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.lblLicense}</label>
                      <select
                        id="licenseType"
                        name="licenseType"
                        value={formData.licenseType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value={LicenseType.CC_BY_SA_4}>Creative Commons (CC BY-SA)</option>
                        <option value={LicenseType.MIT}>MIT License</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.lblProjectType}</label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value={ProjectType.OPEN_SOURCE}>{t.optOpenSource}</option>
                        <option value={ProjectType.EXPERIMENTAL}>{t.optExperimental}</option>
                        <option value={ProjectType.COMMERCIAL}>{t.optCommercial}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.lblDesc}</label>
                    <textarea
                      id="projectDescription"
                      name="projectDescription"
                      required
                      rows={4}
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      placeholder={t.phDesc}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.btnGenerating}
                      </>
                    ) : (
                      t.btnGenerate
                    )}
                  </button>
                  
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-slate-800/50 rounded-xl p-4 border border-blue-100 dark:border-slate-700 flex items-start gap-3">
              <div className="text-blue-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200" dangerouslySetInnerHTML={{ __html: formData.licenseType === LicenseType.MIT ? t.mitInfo : t.ccInfo }} />
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:sticky lg:top-24">
            {!result ? (
              <div className="h-96 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-gray-400 dark:text-slate-600 p-8 text-center bg-gray-50/50 dark:bg-slate-900/50">
                <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{t.emptyTitle}</h3>
                <p className="text-sm mt-1 max-w-xs">{t.emptyText}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col h-[600px]">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => setActiveTab('license')}
                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                      activeTab === 'license'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-b-2 border-green-500'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    LICENSE
                  </button>
                  <button
                    onClick={() => setActiveTab('readme')}
                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                      activeTab === 'readme'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-b-2 border-green-500'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    README.md
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow p-0 relative overflow-hidden flex flex-col">
                  {/* Toolbar */}
                  <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} z-10 flex gap-2`}>
                     <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      <DownloadIcon />
                      {t.btnDownload}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>

                  <div className="flex-grow overflow-auto p-6 bg-gray-50 dark:bg-slate-900/50">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-300 leading-relaxed dir-ltr text-left">
                      {activeTab === 'license' ? result.licenseContent : result.readmeContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-800 mt-auto">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}