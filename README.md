# أرمادا | Armada Perfume Store

موقع متجر أرمادا للعطور الفاخرة - جاهز للنشر على Cloudflare Pages.

## 🚀 خطوات النشر على Cloudflare Pages

### الطريقة 1: GitHub + Cloudflare Pages (موصى بها)

1. **المستودع جاهز:** تم إنشاء هذا المستودع وتجهيزه ليتم ربطه مباشرة بـ Cloudflare.
2. **في Cloudflare Pages:**
   - اذهب إلى: [pages.cloudflare.com](https://pages.cloudflare.com)
   - اضغط **"Create a project"** ← **"Connect to Git"**
   - اختر هذا المستودع من حسابك على GitHub.
   - **إعدادات البناء (Build Settings):**
     - **Framework preset:** `Vite`
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** `/`
   - اضغط **"Save and Deploy"** ✅

### الطريقة 2: الرفع المباشر (Direct Upload)

إذا كنت تفضل الرفع اليدوي دون استخدام Git:
1. اذهب إلى Cloudflare Pages.
2. اختر **"Direct Upload"**.
3. قم بسحب وإفلات مجلد `dist` الموجود في هذا المشروع.

---

## 📦 مميزات المتجر

- ✅ 14 عطر كامل بالصور والتفاصيل.
- ✅ نظام سلة تسوق متكامل.
- ✅ عرض سريع للمنتجات (Quick View).
- ✅ فلتر بالأقسام (رجالي / نسائي / للجنسين / شرقي).
- ✅ بحث فوري وترتيب حسب السعر.
- ✅ تكامل واتساب مباشر لإتمام الطلب.
- ✅ تصميم متجاوب (Responsive) بالكامل.
- ✅ رقم الواتساب المبرمج: `+966 55 509 8359`.

---

## 💻 التشغيل والتطوير المحلي

إذا أردت التعديل على الكود وتشغيله محلياً:

```bash
# تثبيت المكتبات
npm install

# تشغيل الموقع في بيئة التطوير
npm run dev
```

تم التجهيز بواسطة Manus.
