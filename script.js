document.addEventListener('DOMContentLoaded', function () {
    // 'Tabloyu Oluştur' butonuna tıklandığında
    document.getElementById('tablo-olustur').addEventListener('click', function () {
        const satirSayisi = parseInt(document.getElementById('satir-sayisi').value);
        const sutunSayisi = parseInt(document.getElementById('sutun-sayisi').value);
        const teknikSecimi = document.getElementById('teknik-secimi').value;

        if (teknikSecimi === 'iyimserlik' || teknikSecimi === 'kotumserlik' || teknikSecimi === 'es-olasilik') {
            document.getElementById('form-bolumu').style.display = 'none';
            document.getElementById('tablo-bolumu').style.display = 'block';

            const tabloKapsayici = document.getElementById('tablo-kapsayici');
            tabloKapsayici.innerHTML = '';

            let tablo = '<table border="1"><tr>';
            tablo += `<th>Seçenekler</th>`;
            for (let sutun = 1; sutun <= sutunSayisi; sutun++) {
                tablo += `<th>Doğal Durum ${sutun} <input type="text" placeholder="Durum ${sutun} açıklaması"></th>`;
            }
            tablo += '</tr>';

            for (let satir = 1; satir <= satirSayisi; satir++) {
                tablo += `<tr><td>Seçenek ${satir} <input type="text" class="secenek-aciklama" data-satir="${satir}" placeholder="Seçenek ${satir} açıklaması"></td>`;
                for (let sutun = 1; sutun <= sutunSayisi; sutun++) {
                    tablo += `<td><input type="number" class="deger" data-satir="${satir}" data-sutun="${sutun}" placeholder="Değer"></td>`;
                }
                tablo += '</tr>';
            }
            tablo += '</table>';
            tabloKapsayici.innerHTML = tablo;
        } else {
            alert('Lütfen İyimserlik, Kötümserlik veya Eş Olasılık seçimini yapın.');
        }
    });

    // Hesapla butonuna tıklandığında
    document.getElementById('hesapla').addEventListener('click', function () {
        const teknikSecimi = document.getElementById('teknik-secimi').value;
        const kararTuru = document.getElementById('karar-turu').value;
        const degerler = document.querySelectorAll('.deger');
        const secenekMetinleri = document.querySelectorAll('.secenek-aciklama');
        const satirSayisi = parseInt(document.getElementById('satir-sayisi').value);

        let sonucDeger = null;
        let secenekMetni = '';

        if (teknikSecimi === 'iyimserlik') {
            if (kararTuru === 'kar') {
                const satirMaxDegerleri = [];
                secenekMetinleri.forEach((secenek, index) => {
                    let satirMax = -Infinity;
                    degerler.forEach(input => {
                        if (parseInt(input.dataset.satir) === index + 1) {
                            const deger = parseFloat(input.value);
                            if (!isNaN(deger) && deger > satirMax) {
                                satirMax = deger;
                            }
                        }
                    });
                    if (satirMax !== -Infinity) {
                        satirMaxDegerleri.push({ deger: satirMax, secenek: secenek.value });
                    }
                });
                if (satirMaxDegerleri.length > 0) {
                    const maxObj = satirMaxDegerleri.reduce((prev, curr) => (curr.deger > prev.deger ? curr : prev));
                    sonucDeger = maxObj.deger;
                    secenekMetni = maxObj.secenek;
                }
            } else if (kararTuru === 'maliyet') {
                const satirMinDegerleri = [];
                secenekMetinleri.forEach((secenek, index) => {
                    let satirMin = Infinity;
                    degerler.forEach(input => {
                        if (parseInt(input.dataset.satir) === index + 1) {
                            const deger = parseFloat(input.value);
                            if (!isNaN(deger) && deger < satirMin) {
                                satirMin = deger;
                            }
                        }
                    });
                    if (satirMin !== Infinity) {
                        satirMinDegerleri.push({ deger: satirMin, secenek: secenek.value });
                    }
                });
                if (satirMinDegerleri.length > 0) {
                    const minObj = satirMinDegerleri.reduce((prev, curr) => (curr.deger < prev.deger ? curr : prev));
                    sonucDeger = minObj.deger;
                    secenekMetni = minObj.secenek;
                }
            }
        } else if (teknikSecimi === 'kotumserlik') {
            if (kararTuru === 'kar') {
                const satirMinDegerleri = [];
                secenekMetinleri.forEach((secenek, index) => {
                    let satirMin = Infinity;
                    degerler.forEach(input => {
                        if (parseInt(input.dataset.satir) === index + 1) {
                            const deger = parseFloat(input.value);
                            if (!isNaN(deger) && deger < satirMin) {
                                satirMin = deger;
                            }
                        }
                    });
                    if (satirMin !== Infinity) {
                        satirMinDegerleri.push({ deger: satirMin, secenek: secenek.value });
                    }
                });
                if (satirMinDegerleri.length > 0) {
                    const maxObj = satirMinDegerleri.reduce((prev, curr) => (curr.deger > prev.deger ? curr : prev));
                    sonucDeger = maxObj.deger;
                    secenekMetni = maxObj.secenek;
                }
            } else if (kararTuru === 'maliyet') {
                const satirMaxDegerleri = [];
                secenekMetinleri.forEach((secenek, index) => {
                    let satirMax = -Infinity;
                    degerler.forEach(input => {
                        if (parseInt(input.dataset.satir) === index + 1) {
                            const deger = parseFloat(input.value);
                            if (!isNaN(deger) && deger > satirMax) {
                                satirMax = deger;
                            }
                        }
                    });
                    if (satirMax !== -Infinity) {
                        satirMaxDegerleri.push({ deger: satirMax, secenek: secenek.value });
                    }
                });
                if (satirMaxDegerleri.length > 0) {
                    const minObj = satirMaxDegerleri.reduce((prev, curr) => (curr.deger < prev.deger ? curr : prev));
                    sonucDeger = minObj.deger;
                    secenekMetni = minObj.secenek;
                }
            }
        } else if (teknikSecimi === 'es-olasilik') {
            if (kararTuru === 'kar') {
                // Eş Olasılık ve Kar: Her satırdaki değerleri sayısına bölüp toplayarak en büyük değeri al
                const satirToplamDegerleri = [];
                secenekMetinleri.forEach((secenek, index) => {
                    let toplam = 0;
                    let sayac = 0;
                    degerler.forEach(input => {
                        if (parseInt(input.dataset.satir) === index + 1) {
                            const deger = parseFloat(input.value);
                            if (!isNaN(deger)) {
                                toplam += deger;
                                sayac++;
                            }
                        }
                    });
                    if (sayac > 0) {
                        const ortalama = toplam / sayac;
                        satirToplamDegerleri.push({ deger: ortalama, secenek: secenek.value });
                    }
                });
                if (satirToplamDegerleri.length > 0) {
                    const maxObj = satirToplamDegerleri.reduce((prev, curr) => (curr.deger > prev.deger ? curr : prev));
                    sonucDeger = maxObj.deger;
                    secenekMetni = maxObj.secenek;
                }
            } else if (kararTuru === 'maliyet') {
                // Eş Olasılık ve Maliyet: Her satırdaki değerleri sayısına bölüp toplayarak en küçük değeri al
                const satirToplamDegerleri = [];
                secenekMetinleri.forEach((secenek, index) => {
                    let toplam = 0;
                    let sayac = 0;
                    degerler.forEach(input => {
                        if (parseInt(input.dataset.satir) === index + 1) {
                            const deger = parseFloat(input.value);
                            if (!isNaN(deger)) {
                                toplam += deger;
                                sayac++;
                            }
                        }
                    });
                    if (sayac > 0) {
                        const ortalama = toplam / sayac;
                        satirToplamDegerleri.push({ deger: ortalama, secenek: secenek.value });
                    }
                });
                if (satirToplamDegerleri.length > 0) {
                    const minObj = satirToplamDegerleri.reduce((prev, curr) => (curr.deger < prev.deger ? curr : prev));
                    sonucDeger = minObj.deger;
                    secenekMetni = minObj.secenek;
                }
            }
        }

        // Sonucu kullanıcıya göster
        document.getElementById('sonuc').innerHTML = `En iyi seçenek: ${secenekMetni} - Değer: ${sonucDeger}`;
    });
    document.getElementById('yeniden').addEventListener('click', function () {
        document.getElementById('form-bolumu').style.display = 'block';
        document.getElementById('tablo-bolumu').style.display = 'none';
        document.getElementById('sonuc').textContent = '';  // Sonuç kısmını temizle
    });
});
