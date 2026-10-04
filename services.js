/* Replace these mock adapters with API* adapters without changing UI event contracts. */
class MockBudgetService {
  estimate({ income, debt, downPayment, termMonths, energyClass = 'other', ownsHome = false }) {
    const snapshot = window.CasaServices.economicSnapshot;
    const monthlyCapacity = Math.max(0, income * snapshot.paymentShare - debt);
    const monthlyRate = snapshot.housingLoanAnnualRate / 100 / 12;
    const maxLoanByIncome = monthlyRate > 0
      ? monthlyCapacity * (1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate
      : monthlyCapacity * termMonths;
    const ltvIndex = energyClass === 'ab' ? 0 : energyClass === 'c' ? 1 : 2;
    const maxLtvForBand = band => Math.max(0, band.ltv[ltvIndex] * (ownsHome ? .25 : 1));
    const bands = snapshot.ltvBands;
    let maxHomePrice = 0;
    let maxLoanAllowedByLtv = 0;
    for (const band of bands) {
      const ltv = maxLtvForBand(band);
      const priceByCashAndLtv = ltv < 1 ? downPayment / (1 - ltv) : Infinity;
      const candidate = Math.min(downPayment + maxLoanByIncome, priceByCashAndLtv, band.max);
      if (candidate >= band.min && candidate > maxHomePrice) {
        maxHomePrice = candidate;
        maxLoanAllowedByLtv = candidate * ltv;
      }
    }
    const maxLoan = Math.min(maxLoanByIncome, maxLoanAllowedByLtv);
    const estimatedPrice = Math.min(maxHomePrice, downPayment + maxLoan);
    const monthlyPayment = Math.min(monthlyCapacity, maxLoan * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));
    const band = bands.find(item => estimatedPrice >= item.min && estimatedPrice <= item.max) || bands[bands.length - 1];
    return {
      low: estimatedPrice * .92, high: estimatedPrice, estimatedPrice,
      maxLoan, monthlyPayment, monthlyCapacity, annualRate: snapshot.housingLoanAnnualRate,
      monthlyRate: monthlyRate * 100, termMonths, energyClass, ownsHome,
      ltv: band ? maxLtvForBand(band) : 0,
      policyRate: snapshot.policyRateAnnual,
      snapshotDate: snapshot.rateDate,
      disclaimer: 'Bu sonuç planlama amaçlı yaklaşık simülasyondur; banka teklifi veya kredi onayı değildir. Banka masrafları, sigorta ve kişisel kredi değerlendirmesi dahil değildir.'
    };
  }
}
class MockLeadService {
  create(input) { return { ...input, budget: '₺5–6M', status: 'ACTIVE', createdAt: new Date().toISOString() }; }
  update(lead, input) { return { ...lead, ...input, updatedAt: new Date().toISOString() }; }
}
class MockVerificationService { verify(code) { return code === '123456'; } }
class MockMatchingService { async find() { await new Promise(resolve => setTimeout(resolve, 850)); return { count: 7, propertyIds: ['p-1','p-2','p-3','p-4'] }; } }
class MockCoinService {
  access(state, lead) {
    if (state.token < lead.token) return { ok: false };
    state.token -= lead.token;
    state.transactions.unshift({ note: `${lead.place} · ${lead.rooms} talep erişimi`, date: new Date().toLocaleDateString('tr-TR'), amount: -lead.token, balance: state.token });
    state.activeLead = true;
    return { ok: true };
  }
  purchase(state, pack) {
    if (!pack) return { ok: false };
    state.token += pack.coins;
    state.transactions.unshift({ note: `${pack.name} Coin paketi · demo alımı`, date: new Date().toLocaleDateString('tr-TR'), amount: pack.coins, balance: state.token });
    return { ok: true, balance: state.token };
  }
}
class MockPropertyService {
  extract(url) { return { url, title: 'Fethiye Merkez 2+1', price: 5250000, place: 'Fethiye Merkez', sqm: 110, rooms: '2+1', checks: ['Fiyat','Konum','İlan aktifliği','Veri tutarlılığı','Duplicate kontrolü'] }; }
  save(state) { state.propertyAdded = true; state.propertyApproved = false; }
  approve(state) { state.propertyApproved = true; }
}
class MockOfferService { create(property) { return { title: `${property.title} · ${property.price}`, desc: 'Ahmet Yılmaz’ın talebine gönderildi.', status: 'GÖNDERİLDİ', date: new Date().toLocaleDateString('tr-TR') }; } }
class MockChatService {
  send(state, role, text) { state.messages.push({ from: role === 'b2c' ? 'Ahmet' : 'Firma', text, time: new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}) }); }
}
class MockContactUnlockService { approve(state, role) { state.contact[role === 'b2c' ? 'b2c' : 'b2b'] = true; state.contact.open = state.contact.b2c && state.contact.b2b; return state.contact.open; } }
class MockAppointmentService { create(input) { return { ...input, createdAt: new Date().toISOString() }; } }
window.CasaServices = {
  budget: new MockBudgetService(), lead: new MockLeadService(), verification: new MockVerificationService(),
  matching: new MockMatchingService(), coins: new MockCoinService(), property: new MockPropertyService(),
  offer: new MockOfferService(), chat: new MockChatService(), contactUnlock: new MockContactUnlockService(),
  appointment: new MockAppointmentService()
};
window.CasaServices.economicSnapshot = {
  rateDate: '25 Eylül 2026 haftası', housingLoanAnnualRate: 41.82, policyRateAnnual: 37,
  paymentShare: .35,
  rateSource: 'https://tcmb.gov.tr/wps/wcm/connect/TR/TCMB%2BTR/Main%2BMenu/Istatistikler/Faiz%2BIstatistikleri/Haftalik/Kredi%2BFaiz%2BOranlari/',
  policySource: 'https://tcmb.gov.tr/wps/wcm/connect/TR/TCMB%2BTR/Main%2BMenu/Duyurular/Basin/2026/DUY2026-38',
  ltvDate: '29 Ocak 2026 · 11364 sayılı karar',
  ltvSource: 'https://www.bddk.org.tr/Mevzuat/EkGetir/1210?ekId=283',
  ltvBands: [
    {min:0,max:5000000,ltv:[.90,.80,.70]},
    {min:5000000.01,max:7000000,ltv:[.80,.70,.60]},
    {min:7000000.01,max:10000000,ltv:[.70,.60,.50]},
    {min:10000000.01,max:20000000,ltv:[.50,.40,.30]},
    {min:20000000.01,max:Infinity,ltv:[.40,.30,.20]}
  ]
};
window.CasaServices.coinPacks = [
  { id:'starter', name:'Başlangıç', coins:20, price:199, badge:'' },
  { id:'plus', name:'Avantajlı', coins:70, price:499, badge:'50 Coin bonus', featured:true },
  { id:'pro', name:'Pro', coins:200, price:1199, badge:'50 Coin bonus' },
  { id:'business', name:'Ofis', coins:550, price:2990, badge:'150 Coin bonus' }
];
