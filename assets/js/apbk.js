/* Dipisah dari apbk.html agar halaman bisa memakai Content Security Policy tanpa skrip sebaris. */
  (function () {
    "use strict";
    var $ = function (s) { return document.querySelector(s); };
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    var num = function (n) { return Number(n).toLocaleString("id-ID", { maximumFractionDigits: 2 }); };
    var rp = function (n) { return n == null ? "–" : (n < 0 ? "−" : "") + "Rp" + Math.abs(Math.round(n)).toLocaleString("id-ID"); };
    var rpS = function (n) {
      var a = Math.abs(n), s = n < 0 ? "−" : "";
      if (a >= 1e9) return s + "Rp" + (a / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " M";
      if (a >= 1e6) return s + "Rp" + (a / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
      return rp(n);
    };
    var pct = function (a, b) { return b ? (a / b * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "%" : "0%"; };
    var DATA;

    fetch("data/apbk-2026.json?v=" + Date.now()).then(function (r) { return r.json(); }).then(function (d) { DATA = d; render(d); })
      .catch(function () { $("#lead").textContent = "Data anggaran gagal dimuat. Muat ulang halaman ini."; });

    function render(d) {
      $("#judul").textContent = "Rincian APBKam Kampung Marga Mulya Tahun Anggaran " + d.tahun;
      document.title = "Rincian APBKam Marga Mulya " + d.tahun;
      $("#lead").textContent = "Isi halaman ini mengikuti " + d.dokumen + " yang ditandatangani " + d.penandatangan + " pada " + d.tanggal + ". Angka dalam rupiah.";
      var P = d.pembiayaan;
      $("#stats").innerHTML = [["Pendapatan", d.totalPendapatan], ["Belanja", d.totalBelanja, 1], ["Surplus", d.surplus], ["Pembiayaan netto", P.netto]].map(function (s) {
        return '<div class="stat' + (s[2] ? " stat--blue" : "") + '"><span>' + s[0] + "</span><b>" + rpS(s[1]) + "</b></div>";
      }).join("");

      // Pendapatan
      $("#tPend").innerHTML = "<thead><tr><th>Kelompok / rincian</th><th class='n'>Jumlah</th><th class='n'>Porsi</th></tr></thead><tbody>" +
        d.pendapatan.map(function (k) {
          return '<tr class="akun"><td>' + esc(k.kode) + " " + esc(k.kelompok) + '</td><td class="n">' + rp(k.jumlah) + '</td><td class="n">' + pct(k.jumlah, d.totalPendapatan) + "</td></tr>" +
            (k.rincian.length ? k.rincian.map(function (r) { return '<tr class="item"><td>' + esc(r.nama) + '</td><td class="n">' + rp(r.jumlah) + '</td><td class="n">' + pct(r.jumlah, d.totalPendapatan) + "</td></tr>"; }).join("")
              : '<tr class="sub"><td colspan="3">' + esc(k.ket) + "</td></tr>");
        }).join("") + '<tr class="tot"><td>Jumlah pendapatan</td><td class="n">' + rp(d.totalPendapatan) + '</td><td class="n">100%</td></tr></tbody>';

      // Belanja
      $("#bel").innerHTML = d.belanja.map(function (b) {
        return '<div class="bidang" id="bidang-' + esc(b.kode) + '"><div class="bidhead"><h2>' + esc(b.kode) + ". " + esc(b.nama) + "</h2><b>" + rp(b.jumlah) + " · " + pct(b.jumlah, d.totalBelanja) + "</b></div>" +
          (b.sub.length ? b.sub.map(function (s) {
            return '<div class="subwrap"><div class="subhead"><span>' + esc(s.kode) + " " + esc(s.nama) + "</span><span>" + rp(s.jumlah) + "</span></div>" + s.kegiatan.map(kegiatan).join("") + "</div>";
          }).join("") : '<p class="empty">' + esc(b.ket || "Tidak dianggarkan.") + "</p>") + "</div>";
      }).join("") + '<div class="bidhead"><h2>Jumlah belanja</h2><b>' + rp(d.totalBelanja) + "</b></div>";

      // Rekap
      var tab = function (list, tot) {
        return "<thead><tr><th>Uraian</th><th class='n'>Jumlah</th><th class='n'>Porsi</th></tr></thead><tbody>" + list.map(function (x) {
          return "<tr><td>" + esc(x.nama) + '</td><td class="n">' + rp(x.jumlah) + '</td><td class="n">' + pct(x.jumlah, tot) + "</td></tr>";
        }).join("") + '<tr class="tot"><td>Jumlah</td><td class="n">' + rp(tot) + '</td><td class="n">100%</td></tr></tbody>';
      };
      $("#tJenis").innerHTML = tab(d.jenisBelanja, d.totalBelanja);
      $("#tSumber").innerHTML = tab(d.sumberDana, d.totalBelanja);

      // Pembiayaan
      $("#tPemb").innerHTML = "<thead><tr><th>Uraian</th><th>Sumber</th><th class='n'>Jumlah</th></tr></thead><tbody>" +
        '<tr class="akun"><td colspan="2">6.1 Penerimaan pembiayaan</td><td class="n">' + rp(P.totalPenerimaan) + "</td></tr>" +
        P.penerimaan.map(function (r) { return '<tr class="item"><td>SiLPA tahun sebelumnya</td><td>' + esc(r.nama) + '</td><td class="n">' + rp(r.jumlah) + "</td></tr>"; }).join("") +
        '<tr class="akun"><td colspan="2">6.2 Pengeluaran pembiayaan</td><td class="n">' + rp(P.totalPengeluaran) + "</td></tr>" +
        P.pengeluaran.map(function (r) { return '<tr class="item"><td>' + esc(r.nama) + "</td><td>" + esc(r.sumber || "") + '</td><td class="n">' + rp(r.jumlah) + "</td></tr>"; }).join("") +
        '<tr class="tot"><td colspan="2">Pembiayaan netto</td><td class="n">' + rp(P.netto) + "</td></tr>" +
        '<tr><td colspan="2">Surplus/(defisit) anggaran</td><td class="n">' + rp(d.surplus) + "</td></tr>" +
        '<tr class="tot"><td colspan="2">Selisih pembiayaan (sesuai dokumen)</td><td class="n">' + rp(d.selisih) + "</td></tr></tbody>";

      $("#sumber").innerHTML = "Sumber: " + esc(d.dokumen) + ", ditandatangani " + esc(d.penandatangan) + " pada " + esc(d.tanggal) +
        ". Nama kegiatan mengikuti kode rekening dalam dokumen, sehingga sebagian masih memakai istilah \"desa\". Ringkasan dalam grafik ada di <a href=\"./#apbkam\">halaman Transparansi</a>.";
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
    }

    function kegiatan(k) {
      var rows = k.rincian.map(function (r) {
        if (r.t === "akun") return '<tr class="akun"><td colspan="5">' + esc(r.n) + "</td></tr>";
        if (r.t === "sub") return '<tr class="sub"><td colspan="5">' + esc(r.n) + "</td></tr>";
        if (r.t === "paket") return '<tr class="paket"><td colspan="4">' + esc(r.n) + '</td><td class="n">' + rp(r.j) + "</td></tr>";
        return '<tr class="item"><td>' + esc(r.n) + '</td><td class="n">' + (r.v != null ? num(r.v) : "") + "</td><td>" + esc(r.s || "") + '</td><td class="n">' + (r.h != null ? rp(r.h) : "") + '</td><td class="n">' + rp(r.j) + "</td></tr>";
      }).join("");
      return '<details class="keg" data-cari="' + esc((k.kode + " " + k.nama + " " + k.sumber + " " + k.rincian.map(function (r) { return r.n; }).join(" ")).toLowerCase()) + '"><summary><span class="keg__n">' + esc(k.nama) +
        '<span class="keg__m">Kode ' + esc(k.kode) + " · " + esc(k.sumber) + " · " + k.rincian.filter(function (r) { return r.t === "item"; }).length + ' rincian</span></span><span class="keg__j">' + rp(k.jumlah) + "</span></summary>" +
        (rows ? '<div class="tblwrap"><table class="rinci"><thead><tr><th>Uraian</th><th class="n">Volume</th><th>Satuan</th><th class="n">Harga satuan</th><th class="n">Jumlah</th></tr></thead><tbody>' + rows +
          '<tr class="tot"><td colspan="4">Jumlah kegiatan</td><td class="n">' + rp(k.jumlah) + "</td></tr></tbody></table></div>" : '<p class="empty" style="padding:0 14px">Tidak ada rincian.</p>') + "</details>";
    }

    // Pencarian
    var semua = function () { return [].slice.call(document.querySelectorAll("details.keg")); };
    $("#cari").addEventListener("input", function () {
      var q = this.value.trim().toLowerCase(), n = 0;
      semua().forEach(function (d) { var ok = !q || d.getAttribute("data-cari").indexOf(q) > -1; d.hidden = !ok; if (ok) n++; d.open = !!q && ok; });
      [].slice.call(document.querySelectorAll(".subwrap")).forEach(function (s) { s.hidden = !s.querySelector("details.keg:not([hidden])"); });
      [].slice.call(document.querySelectorAll(".bidang")).forEach(function (b) { var ada = b.querySelector(".subwrap:not([hidden])"); b.hidden = !!q && !ada; });
      $("#hasil").textContent = q ? n + " kegiatan cocok dengan \"" + this.value.trim() + "\"" : "";
    });
    $("#bukaSemua").addEventListener("click", function () { semua().forEach(function (d) { if (!d.hidden) d.open = true; }); });
    $("#tutupSemua").addEventListener("click", function () { semua().forEach(function (d) { d.open = false; }); });

    // Unduh CSV
    $("#btnCsv").addEventListener("click", function () {
      if (!DATA) return;
      var q = function (v) { v = v == null ? "" : String(v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      var L = [["Bidang", "Sub bidang", "Kode kegiatan", "Kegiatan", "Sumber dana", "Akun", "Uraian", "Volume", "Satuan", "Harga satuan", "Jumlah"]];
      DATA.belanja.forEach(function (b) { b.sub.forEach(function (s) { s.kegiatan.forEach(function (k) {
        var akun = "";
        k.rincian.forEach(function (r) {
          if (r.t === "akun") { akun = r.n; return; }
          if (r.t === "item" || r.t === "paket") L.push([b.nama, s.nama, k.kode, k.nama, k.sumber, akun, r.n, r.v, r.s, r.h, r.j]);
        });
      }); }); });
      var blob = new Blob(["﻿" + L.map(function (r) { return r.map(q).join(";"); }).join("\n")], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Rincian-Belanja-APBKam-Marga-Mulya-" + DATA.tahun + ".csv";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
  })();
  document.getElementById("btnCetak").addEventListener("click", function () { window.print(); });

