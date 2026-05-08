// =============================================================
// EDIT YOUR TEAM HERE
// =============================================================
//
// To change a name / role / bio:  edit the strings below in both English
// and Arabic. Save the file. The site auto-reloads.
//
// To add a photo:
//   1. Drop a JPG or PNG file into /public/team/  (e.g. ibrahim.jpg)
//   2. Set the `photo` field on that member to "/team/ibrahim.jpg"
//   3. If you leave `photo` empty, the page shows a branded gradient
//      placeholder — perfectly fine for a pre-seed pitch.
//
// To add another founder: copy any block { ... } below and paste it.
// To remove a founder:    delete the whole block.
// =============================================================

export type TeamMember = {
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  bioEn: string;
  bioAr: string;
  /** Optional photo path (e.g. "/team/ibrahim.jpg") — leave blank for gradient */
  photo?: string;
};

export const TEAM: TeamMember[] = [
  {
    nameEn: 'Mohammed Al-Souyan',
    nameAr: 'محمد آل صويان',
    roleEn: 'Co-Founder · CEO',
    roleAr: 'مؤسس مشارك · الرئيس التنفيذي',
    bioEn: 'Operates Diwan end to end — strategy, fundraising, partnerships across the Kingdom.',
    bioAr: 'يقود ديوان من الاستراتيجية إلى التمويل، وشبكة الشراكات في أنحاء المملكة.',
    photo: '/team/mohammed.png',
  },
  {
    nameEn: 'Ibrahim Khaled Alwargan',
    nameAr: 'إبراهيم خالد الورقان',
    roleEn: 'Co-Founder · CTO',
    roleAr: 'مؤسس مشارك · الرئيس التقني',
    bioEn: 'Builds the platform and the AI design pipeline. Bridges customer experience and supplier operations.',
    bioAr: 'يبني المنصة ومحرّك التصميم بالذكاء الاصطناعي، ويربط تجربة العميل بعمليات الموردين.',
    photo: '/team/ibrahim.png',
  },
  {
    nameEn: 'Ahmed Khubrani',
    nameAr: 'أحمد خبراني',
    roleEn: 'Co-Founder · Chief of Logistics & Supply',
    roleAr: 'مؤسس مشارك · رئيس اللوجستيات والتوريد',
    bioEn: 'Owns the supplier network and the logistics layer that delivers the thirty-day promise.',
    bioAr: 'يدير شبكة الموردين والطبقة اللوجستية التي تنفّذ وعد التسليم في ثلاثين يوماً.',
    photo: '/team/ahmed.jpeg',
  },
  {
    nameEn: 'Nasser Almani',
    nameAr: 'ناصر آل مانع',
    roleEn: 'Co-Founder · Chief Design Officer',
    roleAr: 'مؤسس مشارك · رئيس التصميم',
    bioEn: 'Sets the Diwan design language and reviews every concept before it leaves the studio.',
    bioAr: 'يضع لغة تصميم ديوان، ويراجع كل تصوّر قبل خروجه من الاستوديو.',
    photo: '/team/nasser.jpeg',
  },
  {
    nameEn: 'Rayan Alrethaie',
    nameAr: 'ريان الرثيع',
    roleEn: 'Co-Founder · Chief Marketing & Customer Experience',
    roleAr: 'مؤسس مشارك · رئيس التسويق وتجربة العميل',
    bioEn: 'Leads the customer journey from the first touchpoint to handover — and every conversation in between.',
    bioAr: 'يقود رحلة العميل من أوّل لقاء إلى التسليم — وكلّ محادثة بينهما.',
    photo: '/team/rayan.jpeg',
  },
];
