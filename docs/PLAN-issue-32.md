# Plan: Issue #32 - Tahmin vs Gerçek Analizi

## Hedef
İşler için "Tahmin Edilen" (Planned) ve "Gerçekleşen" (Actual) verilerin karşılaştırıldığı analiz raporları oluşturmak. Bu raporlar, proje yönetimindeki sapmaları (maliyet ve süre) izlemeyi sağlayacaktır.

## İhtiyaç Analizi
1. **Veri Modeli (Schema):**
   - `Job` tablosunda "Bütçe" (`budget`) ve "Tahmini Süre" (`estimatedDuration`) alanları eksik.
   - Mevcut durumda sadece `scheduledDate` ve `scheduledEndDate` var, bu "Planlanan Süre" olarak kullanılabilir ama "Bütçe" yok.
2. **Backend (API):**
   - İş oluşturma/güncelleme endpointlerine `budget` ve `estimatedDuration` alanlarının eklenmesi.
   - Yeni bir rapor endpoint'i: `/api/admin/reports/variance`.
     - Her iş için:
       - **Süre Sapması:** (Completed - Started) vs (EstimatedDuration veya ScheduledEnd - ScheduledStart).
       - **Maliyet Sapması:** (Sum(CostTracking.amount)) vs (Job.budget).
3. **Frontend (Web - Admin):**
   - **İş Düzenleme Formu:** Bütçe ve Tahmini Süre giriş alanları.
   - **Rapor Sayfası:** `/admin/reports/analysis`.
     - Tablo ve Grafik (Bar Chart): Her iş için Planlanan vs Gerçekleşen.
4. **Frontend (Mobile - Manager):**
   - İş detayında bu verilerin (salt okunur) gösterilmesi.

## Adım Adım Uygulama Planı

### Faz 1: Veritabanı ve Backend
1. `apps/web/prisma/schema.prisma` dosyasını güncelle:
   - `Job` modeline `budget` (Float) ve `estimatedDuration` (Int, dakika cinsinden) ekle.
2. Migration işlemini yap (`npx prisma db push`).
3. `jobCreationSchema` (zod) güncellemesi.
4. `jobs.ts` server action güncellemesi.

### Faz 2: Web Arayüzü (Veri Girişi)
1. `apps/web/components/forms/create-job-form.tsx` (veya ilgili form) güncellemesi: Bütçe ve Süre inputları.
2. `apps/web/app/[locale]/admin/jobs/[id]/page.tsx`: Detay sayfasında bu verilerin gösterimi.

### Faz 3: Raporlama (Web)
1. Endpoint: `apps/web/app/api/admin/reports/variance/route.ts`.
   - Veri çekme ve hesaplama mantığı.
2. Sayfa: `apps/web/app/[locale]/admin/reports/analysis/page.tsx`.
   - `recharts` kullanarak Süre ve Maliyet karşılaştırma grafikleri.
   - Detaylı veri tablosu.

### Faz 4: Mobil Entegrasyon
1. `EditJobScreen.js` ve `JobDetailScreen.js` güncellemeleri.
   - `budget` ve `estimatedDuration` alanlarını görüntüle/düzenle.

## Test Kriterleri
- Yeni br iş oluştururken Bütçe girilebiliyor mu?
- Rapor sayfasında, tamamlanmış bir işin maliyeti bütçeyi aştığında bu durum görselleştiriliyor mu?
- Süre sapmaları doğru hesaplanıyor mu?
