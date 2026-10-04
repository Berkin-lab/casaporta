/* CasaPorta taxonomy: curated discovery taxonomy (196 selectable listing categories). */
(() => {
  const roots = [
    {
      id: 'gayrimenkul', title: 'Gayrimenkul', groups: [
        {name:'Konut', items:['Daire','Stüdyo Daire','Loft Daire','Rezidans','Müstakil Ev','Villa','Yalı','Köşk','Çiftlik Evi','Köy Evi','Yazlık','Dağ Evi','Bungalov','Tiny House','Prefabrik Ev','Kooperatif Konutu','Dubleks Daire','Tripleks Daire','Bahçe Katı Daire','Çatı Dubleksi','Apart Daire','Öğrenci Evi','Lojman','Devremülk','Site İçi Konut']},
        {name:'Ticari Gayrimenkul', items:['Dükkan','Mağaza','Ofis','Plaza Ofisi','Depo','Antrepo','Fabrika','Atölye','İmalathane','Showroom','Restoran','Kafe','Otel','Motel','Pansiyon','Apart Otel','Sağlık Merkezi','Klinik','Muayenehane','Eğitim Kurumu','Öğrenci Yurdu','Spor Salonu','Akaryakıt İstasyonu','Oto Galeri']}
      ]
    },
    {
      id: 'tasinmaz', title: 'Taşınmaz', groups: [
        {name:'Arsa ve Arazi', items:['Konut İmarlı Arsa','Ticari İmarlı Arsa','Sanayi İmarlı Arsa','Turizm İmarlı Arsa','İmarlı Arsa','İmarsız Arsa','Müstakil Tapulu Arsa','Hisseli Arsa','İfrazlı Arsa','Kat Karşılığı Arsa','Hasılat Paylaşımlı Arsa','Köy Yerleşik Alanı Arsası','Tarla','Bağ','Bahçe','Zeytinlik','Meyve Bahçesi','Sera','Çiftlik Arazisi','Orman Vasfı Dışındaki Arazi','Mera Niteliğinde Taşınmaz','Tarımsal Üretim Arazisi','Kıyı Arsası','Turizm Arazisi']},
        {name:'Bina, Proje ve Özel Taşınmaz', items:['Komple Bina','Apartman','Rezidans Bloğu','İş Hanı','İş Merkezi Binası','Sanayi Tesisi','Fabrika Binası','Depo Binası','Otel Binası','Tatil Köyü','Eğitim Kampüsü','Hastane Binası','Öğrenci Yurdu Binası','Otopark','AVM','Akaryakıt Tesisi','Enerji Tesisi','Güneş Enerjisi Sahası','Rüzgar Enerjisi Sahası','Devam Eden Konut Projesi','Yeni Konut Projesi','Karma Kullanımlı Proje','Villa Projesi','Arsa Payı','Kat İrtifaklı Taşınmaz']}
      ]
    }
  ];
  const categories = [];
  for (const root of roots) for (const group of root.groups) for (const item of group.items) {
    for (const intent of ['Satılık','Kiralık']) categories.push({
      id: `${root.id}-${categories.length+1}`, rootId: root.id, rootTitle: root.title,
      group: group.name, assetType: item, intent, name: `${intent} ${item}`, active: true,
      rank: categories.length + 1
    });
  }
  window.CasaCategories = { roots, categories, total: categories.length };
})();
