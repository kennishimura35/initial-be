const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class Join {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }

  allMakanan = (makanan, result) => {
    const nama_makanan = `%${makanan[0].nama_makanan}%`
    const query = `select m.id as id_makanan, rm.id as id_rumah_makan, 
    m.nama_makanan, m.tipe_makanan, 
    m.image1, m.image2, m.created_at,
    -- m.filosopi, m.memasak, m.bahan_baku, m.mencicipi, m.menghidangkan, m.pengalaman_unik, 
    -- m.etika_dan_etiket, 
    rm.nama_rumah_makan, rm.alamat as alamat_rumah_makan, m.alamat as alamat_makanan, rm.id_kecamatan as kecamatan_rm, 
    k.kecamatan 
    from makanan m left join rumah_makan rm on m.id_rumah_makan = rm .id 
    left join kecamatan k 
    on rm.id_kecamatan  = k.id or m.id_kecamatan = k.id where lower(m.nama_makanan) like lower(?) order by m.created_at desc`
    this.#connection.query(query, [nama_makanan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  allMakananTerbaru = (makanan, result) => {
    const nama_makanan = `%${makanan[0].nama_makanan}%`
    const query = `select m.id as id_makanan, rm.id as id_rumah_makan, 
    m.nama_makanan, m.tipe_makanan, 
    m.image1, m.image2, m.created_at,
    -- m.filosopi, m.memasak, m.bahan_baku, m.mencicipi, m.menghidangkan, m.pengalaman_unik, 
    -- m.etika_dan_etiket, 
    rm.nama_rumah_makan, rm.alamat as alamat_rumah_makan, m.alamat as alamat_makanan, rm.id_kecamatan as kecamatan_rm, 
    k.kecamatan 
    from makanan m left join rumah_makan rm on m.id_rumah_makan = rm .id 
    left join kecamatan k 
    on rm.id_kecamatan  = k.id or m.id_kecamatan = k.id where lower(m.nama_makanan) like lower(?) order by m.created_at desc LIMIT 3`
    this.#connection.query(query, [nama_makanan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  allKudapanByKecamatan = (kecamatan, result) => {
    const query = `select m.id, m.nama_makanan, m.tipe_makanan, m.image1, m.image2, m.filosopi, m.memasak, m.bahan_baku, m.mencicipi,
    m.menghidangkan, m.pengalaman_unik, m.etika_dan_etiket, m.alamat, m.id_kecamatan , k.kecamatan 
    from makanan m 
    left join kecamatan k 
    on m.id_kecamatan = k.id 
    where tipe_makanan = 'kudapan' and id_rumah_makan is null 
    and k.kecamatan = ? `
    this.#connection.query(query, [kecamatan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  allKudapan = (result) => {
    const query = `select m.id, m.nama_makanan, m.tipe_makanan, m.image1, m.image2, m.filosopi, m.memasak, m.bahan_baku, m.mencicipi,
    m.menghidangkan, m.pengalaman_unik, m.etika_dan_etiket, m.alamat, m.id_kecamatan
    from makanan m 
    where tipe_makanan = 'kudapan' and id_rumah_makan is null `
    this.#connection.query(query, (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  allRumahMakanByKecamatan = (kecamatan, result) => {
    const query = `	select rm.id as id_rumah_makan, rm.nama_rumah_makan, rm.id_kecamatan, rm.image1, rm.image2, 
    rm.content, rm.alamat, k.kecamatan 
    from rumah_makan rm 
    left join kecamatan k 
    on k.id = rm.id_kecamatan  where k.kecamatan = ? `
    this.#connection.query(query, [kecamatan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };
  

  allMenuByIdRumahMakan = (id_rumah_makan, result) => {
    const query = `	select m.id as id_makanan, rm.id as id_rumah_makan, m.nama_makanan, m.tipe_makanan, 
    m.image1, m.image2, m.filosopi, m.memasak, m.bahan_baku, m.mencicipi, m.menghidangkan, m.pengalaman_unik, 
    m.etika_dan_etiket, rm.nama_rumah_makan, rm.alamat, rm.id_kecamatan as kecamatan_rm, 
    k.kecamatan 
    from makanan m left join rumah_makan rm on m.id_rumah_makan = rm .id 
    left join kecamatan k 
    on rm.id_kecamatan  = k.id 
    where id_rumah_makan = ? 
     `
    this.#connection.query(query, [id_rumah_makan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  detailMakanan = (id_makanan, result) => {
    const query = `	select m.id as id_makanan, rm.id as id_rumah_makan, 
    m.nama_makanan, m.tipe_makanan, 
    m.image1, m.image2, m.id_kecamatan, 
    m.filosopi, m.memasak, m.bahan_baku, m.mencicipi, m.menghidangkan, m.pengalaman_unik, 
    m.etika_dan_etiket, 
    rm.nama_rumah_makan, rm.alamat as alamat_rumah_makan, m.alamat as alamat_makanan, rm.id_kecamatan as kecamatan_rm, 
    k.kecamatan 
    from makanan m left join rumah_makan rm on m.id_rumah_makan = rm .id 
    left join kecamatan k 
    on rm.id_kecamatan  = k.id or m.id_kecamatan = k.id 
    where m.id = ? 
     `
    this.#connection.query(query, [id_makanan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  detailRumahMakan = (id_rumah_makan, result) => {
    const query = `	select rm.id as id_rumah_makan, rm.nama_rumah_makan, rm.id_kecamatan, rm.image1, rm.image2, 
    rm.content, rm.alamat, k.kecamatan 
    from rumah_makan rm 
    left join kecamatan k 
    on k.id = rm.id_kecamatan  where rm.id = ? 
     `
    this.#connection.query(query, [id_rumah_makan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };



}

module.exports = { Join };
