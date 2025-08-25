Bu proje, Docker tabanlı full-stack bir iş yönetim sistemidir. Sistem, kullanıcıların farklı türde iş (job) tetikleyip sonuçlarını takip etmelerini sağlar. Joblar, çalıştırıldığında sonuçlarını bir veritabanına kaydeder ve kullanıcılar API veya frontend üzerinden detayları görüntüleyebilir.

Özellikler
Backend (Python + Flask + RESTful API)

Sisteme farklı iş tipleri eklenebilir; başlangıçta iki job bulunmaktadır:

OS Job: Sistemin çalıştığı dizinde işletim sistemi komutlarını çalıştırır ve çıktısını kaydeder.

Crawl Job: Girilen web sitesini tarar (crawl) ve toplam URL sayısını veritabanına kaydeder. Her URL ayrı bir kayıt olarak tutulur.

Joblar asenkron olarak çalıştırılır.

Veriler SQLite ile saklanır (dilerseniz PostgreSQL/MySQL/MongoDB ile entegre edilebilir).

CORS desteği ve RESTful API mimarisi ile frontend’den erişilebilir.

Kullanılan teknolojiler: Python, Flask, Flask-CORS, Requests, BeautifulSoup, NetworkX, Threading.

Frontend (JavaScript + React + Vite)

React ve UI kütüphanesi (MUI) kullanılarak modern bir arayüz geliştirilmiştir.

API ile entegrasyon sağlanarak job tetikleme ve sonuç görüntüleme işlemleri gerçekleştirilir.

Çalıştırılan OS komutlarının çıktısı ve crawl job geçmişi tablolar halinde görüntülenir.

Server-side pagination ve filtreleme desteklenir.

React Query kullanılarak veri yönetimi ve asenkron işlemler optimize edilmiştir.

Frontend, Vite build aracı kullanılarak geliştirilmiştir.

Neden Katana Kullanılmadı?

Katana gibi özel crawl araçları yerine requests + BeautifulSoup + NetworkX kullanıldı çünkü:

Daha hafif ve bağımsız bir çözüm sunar.

Docker ortamında kolayca çalıştırılabilir.

İşlevsellik açısından Katana’nın sunduğu temel URL tarama ve link çıkarma özellikleri yeterlidir.

Zorluklar ve Çözümler

CORS hataları: Flask-CORS ile çözülmüştür.

Asenkron job çalıştırma: Python threading kullanılarak uygulanmıştır.

Frontend-backend entegrasyonu: React Query ve environment değişkenleri ile sorunsuz bağlanmıştır.

Docker entegrasyonu: Hem frontend hem backend containerize edilmiştir ve docker-compose ile birlikte çalıştırılabilir.
