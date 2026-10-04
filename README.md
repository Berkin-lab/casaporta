# CasaPorta interactive demo

This is a dependency-free, responsive frontend prototype. It uses mock data only; there is no scraping, payment, SMS, email, banking, or AI integration.

The complete prototype uses a dark navy interface with restrained gold accents and green verification states. Lead contact details are shown as crisp masked characters; no blur is used.

## Run

Open `index.html` in a modern browser. For a local HTTP preview, run `node server.js` from this folder and visit `http://127.0.0.1:4181`. Demo state is saved in the browser's `localStorage`; choose **Demo verisini sıfırla** in the sidebar to start over.

## Demo paths

- **B2C:** Bütçemi Hesapla → Talebini oluştur → demo OTP `123456` → eşleşmeler → portföy detayı → ilgileniyorum → mesajlaşma → role switch to Emlak Demo to provide the other contact approval → appointment → feedback.
- **B2B:** Emlak Demo → Talepler → lead'e Coin harca → choose an existing portfolio or add a similar portfolio → send offer → chat → mutual contact approval → appointment. Coin & Paket alanından demo Coin paketleri de bakiyeye eklenebilir.
- **Portfolio review:** Emlak Demo → Portföyler → Portföy ekle → enter any demo URL → Portföyü kontrol et → save → switch to Admin Demo → Admin → İncele → Onayla.
- Switch roles with **Rolü değiştir**. The admin, property developer, real estate firm, and B2C buyer share the same browser state.

## Structure and backend seam

- `index.html`: app shell and entry point
- `styles.css`: responsive visual system and components
- `app.js`: demo data, UI rendering, and state transitions
- `services.js`: replaceable mock service adapters for budget, leads, verification, matching, tokens, properties, offers, chat, contact unlock, and appointments
- `types/index.d.ts`: TypeScript domain and package-config contracts for the next backend-connected implementation
- `server.js`: optional local static-file server

Business actions are currently mocked in the frontend. Keep the service methods and state shapes when replacing mock operations with API adapters, and persist authoritative state on the backend.

All listings, people, Coin balances, package prices, messages, and contact details are fictional demo data. Coin package checkout is simulated and adds Coin to the local balance; no real payment is processed. Budget estimates are illustrative and not financing advice.
