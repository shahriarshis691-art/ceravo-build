(function () {
  const unspecified = 'Not specified';
  const BRAND_NAMES = {
    mir: 'MIR Ceramic',
    khadim: 'Khadim Ceramic'
  };

  const tileTypeSlugFor = (tileType) => {
    if (tileType === 'Wall') return 'wall';
    if (tileType === 'Floor') return 'floor';
    if (tileType === 'Wall & Floor') return 'wall-floor';
    return 'not-specified';
  };

  const collectImages = (item) => {
    const raw = []
      .concat(item.images, item.gallery, item.image, item.imageUrl, item.image_url, item.thumbnail)
      .flat()
      .filter((src) => typeof src === 'string');
    const seen = new Set();
    const images = [];
    raw.forEach((src) => {
      const value = src.trim();
      if (!value) return;
      if (/^[a-zA-Z]:[\\/]/.test(value) || /^file:/i.test(value)) return;
      if (seen.has(value)) return;
      seen.add(value);
      images.push(value);
    });
    return images;
  };

  const product = (item) => {
    const brand = BRAND_NAMES[item.brandSlug] || item.brand;
    const productName = item.productName || item.title;
    const sku = item.sku || item.code || unspecified;
    const collection = item.collection || unspecified;
    const tileType = item.tileType || unspecified;
    const size = item.size || unspecified;
    const color = item.color || unspecified;
    const finish = item.finish || unspecified;
    const surface = item.surface || unspecified;
    const effect = item.effect || unspecified;
    const suitableSpace = item.suitableSpace || unspecified;
    const availability = item.availability || unspecified;
    const images = collectImages(item);
    const image = images[0] || '';
    const sizeSearch = String(size).toLowerCase().replace(/×/g, 'x').replace(/\s+/g, ' ');
    return {
      id: item.id,
      brandSlug: item.brandSlug,
      brand,
      productName,
      title: productName,
      sku,
      code: sku,
      collection,
      tileType,
      tileTypeSlug: tileTypeSlugFor(tileType),
      size,
      finish,
      surface,
      color,
      effect,
      suitableSpace,
      availability,
      shortDescription: item.shortDescription || '',
      description: item.description || unspecified,
      sourceUrl: item.sourceUrl || '',
      sourceLabel: item.sourceLabel || unspecified,
      images,
      image,
      hasManufacturerImage: Boolean(image),
      searchText: [brand, productName, sku, collection, size, sizeSearch, sizeSearch.replace(/\s+/g, '')].join(' ').toLowerCase()
    };
  };

  const seenKeys = new Set();
  const catalog = [];
  const addProduct = (item) => {
    const sku = String(item.sku || item.code || '').trim().toUpperCase();
    const key = `${item.brandSlug}:${sku}`;
    if (!sku || seenKeys.has(key)) return;
    seenKeys.add(key);
    catalog.push(product(item));
  };

  const mirWall = ({ sku, detailsId, look, surface, colour, body }) => {
    addProduct({
      id: `mir-${sku.toLowerCase()}`,
      brandSlug: 'mir',
      productName: sku,
      sku,
      tileType: 'Wall',
      size: '30 × 60 cm',
      finish: unspecified,
      surface,
      color: colour,
      effect: look,
      description: `${sku} is a 30 × 60 cm rectangular ${body} wall tile listed by MIR Ceramic. Look: ${look}. Surface: ${surface}. Colour: ${colour}. Packing listed on the manufacturer page: 8 pieces per box (1.44 sqm / box). The technical specification table is labelled Wall Tiles.`,
      sourceUrl: `https://mirceramic.com/details/${detailsId}`,
      sourceLabel: 'MIR Ceramic product page'
    });
  };

  const mirFloor = ({ sku, detailsId, look, surface, colour, body, specLabel }) => {
    addProduct({
      id: `mir-${sku.toLowerCase()}`,
      brandSlug: 'mir',
      productName: sku,
      sku,
      tileType: 'Floor',
      size: '60 × 60 cm',
      finish: unspecified,
      surface,
      color: colour,
      effect: look,
      description: `${sku} is a 60 × 60 cm square ${body} floor tile listed by MIR Ceramic. Look: ${look}. Surface: ${surface}. Colour: ${colour}. Packing listed on the manufacturer page: 4 pieces per box (1.44 sqm / box). The technical specification table is labelled ${specLabel}.`,
      sourceUrl: `https://mirceramic.com/details/${detailsId}`,
      sourceLabel: 'MIR Ceramic product page'
    });
  };

  const KHADIM_IMAGES = {
    'kcl-g-402gr': 'https://khadimceramics.com/wp-content/uploads/2025/04/KCL-G-402GR-H-scaled.jpg',
    'kcl-g-404': 'https://khadimceramics.com/wp-content/uploads/2025/04/KCL-G-404-HL-scaled.jpg',
    'kcl-g-410-bg': 'https://khadimceramics.com/wp-content/uploads/2026/04/KCL_G_410-BG_HL1.jpg',
    'kcl-g-451': 'https://khadimceramics.com/wp-content/uploads/2024/05/KCL-G-451_HL1-scaled.jpg',
    'kcl-g-452': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_G_452BG_HL2.jpg',
    'kcl-g-453': 'https://khadimceramics.com/wp-content/uploads/2024/05/KCL-G-453_HL1-scaled.jpg',
    'kcl-g-455-cr': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL-G-455CR-HL1-scaled.jpg',
    'kcl-g-456-g': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL-G-456G_HL-scaled-1.jpg',
    'kcl-g-457-g': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_G_457G_HL1-scaled-1.jpg',
    'kcl-g-458-g': 'https://khadimceramics.com/wp-content/uploads/2026/04/KCL_G_458GHL1.jpg',
    'kcl-g-459-g': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_G_459HL-scaled-1.jpg',
    'kcl-g-466-sg': 'https://khadimceramics.com/wp-content/uploads/2024/12/KCL_G_466_HL1.jpg',
    'kcl-m-442-r1': 'https://khadimceramics.com/wp-content/uploads/2025/12/KCL-M-442-R1.jpg',
    'kcl-m-492': 'https://khadimceramics.com/wp-content/uploads/2025/12/KCL-M-492.jpg',
    'kcl-m-493': 'https://khadimceramics.com/wp-content/uploads/2025/12/KCL-M-493.jpg',
    'kcl-s-4001': 'https://khadimceramics.com/wp-content/uploads/2023/04/KCL_S_4001-scaled-1.jpg',
    'kcl-s-4002': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_S_4002-scaled-1.jpg',
    'kcl-s-4003': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_S_4003-scaled-1.jpg',
    'kcl-s-4004': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_S_4004-scaled-1.jpg',
    'kcl-m-481': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_M_481BG_HL1-scaled.jpg',
    'kcl-m-482-g': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_M_482G_HL1-scaled-1.webp',
    'kcl-m-482-gr': 'https://khadimceramics.com/wp-content/uploads/2026/04/KCL_M_482-GR_HL1.jpg',
    'kcl-m-484': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_M_484HL11-scaled.jpg',
    'kcl-m-485': 'https://khadimceramics.com/wp-content/uploads/2024/03/KCL_M_485_HL1-scaled.jpg',
    'kcl-m-487': 'https://khadimceramics.com/wp-content/uploads/2024/05/KCL_M_487_HL1-scaled.jpg',
    'kcl-m-488': 'https://khadimceramics.com/wp-content/uploads/2024/05/KCL_M_488_HL-scaled.jpg'
  };

  const khadimProduct = ({ id, sku, collection, tileType, finish, sourcePath }) => {
    const collectionText = collection
      ? ` in the ${collection} collection`
      : '. Collection is not specified on the product page';
    const image = KHADIM_IMAGES[id] || '';
    addProduct({
      id,
      brandSlug: 'khadim',
      productName: sku,
      sku,
      collection: collection || unspecified,
      tileType,
      size: '30 × 60 cm',
      finish,
      surface: unspecified,
      description: `${sku} is listed by Khadim Ceramic Limited${collectionText}. The manufacturer states size 30 cm × 60 cm, finish type ${finish}, and “To Be Used In: ${tileType}”. Colour, surface, and effect are not specified on the product page.`,
      sourceUrl: `https://khadimceramics.com/product/${sourcePath}/`,
      sourceLabel: 'Khadim Ceramic product page',
      image,
      images: image ? [image] : []
    });
  };

  /* MIR Ceramic wall tiles — manufacturer spec column: Wall Tiles */
  mirWall({ sku: 'WH-36215', detailsId: '908', look: 'Pattern', surface: 'Glossy', colour: 'Ivory', body: 'White Body' });
  mirWall({ sku: 'WH-36205', detailsId: '773', look: 'Stone', surface: 'Glossy', colour: 'Brown', body: 'White Body' });
  mirWall({ sku: 'WH-36212', detailsId: '787', look: 'Marble', surface: 'Punch', colour: 'Blue', body: 'White Body' });
  mirWall({ sku: 'WH-36218', detailsId: '794', look: 'Pattern', surface: 'Glossy', colour: 'Pink', body: 'White Body' });
  mirWall({ sku: 'WH-36219', detailsId: '1117', look: 'Pattern', surface: 'Glossy', colour: 'Beige', body: 'White Body' });
  mirWall({ sku: 'WH-36206', detailsId: '775', look: 'Wooden', surface: 'Glossy', colour: 'Brown', body: 'White Body' });
  mirWall({ sku: 'WH-36200', detailsId: '771', look: 'Pattern', surface: 'Punch', colour: 'White', body: 'White Body' });
  mirWall({ sku: 'WH-36213', detailsId: '789', look: 'Pattern', surface: 'Punch', colour: 'White', body: 'White Body' });
  mirWall({ sku: 'WDG-3632', detailsId: '766', look: 'Marble', surface: 'Glossy', colour: 'Blue', body: 'Red Body' });
  mirWall({ sku: 'WDG-3618', detailsId: '868', look: 'Marble', surface: 'Glossy', colour: 'Ivory', body: 'Red Body' });

  /* MIR Ceramic floor tiles — manufacturer spec labelled porcelain / homogeneous / mirror polish floor */
  mirFloor({ sku: 'RCM-6607', detailsId: '1017', look: 'Pattern', surface: 'Curving Matt', colour: 'Grey', body: 'Porcelain', specLabel: 'Typical Value of Mir Porcelain Floor' });
  mirFloor({ sku: 'GMP-6634', detailsId: '998', look: 'Geometric', surface: 'Glazed Mirror Polish', colour: 'Ivory', body: 'Porcelain', specLabel: 'Typical Value of Mir Mirror Polish Floor' });
  mirFloor({ sku: 'G-6600', detailsId: '1019', look: 'Stone', surface: 'Dosing', colour: 'Cream', body: 'Homogeneous', specLabel: 'Typical Value of Mir Homogeneous Floor' });

  /* Khadim Ceramic — Wall */
  khadimProduct({ id: 'kcl-g-402gr', sku: 'KCL-G-402GR', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-402gr' });
  khadimProduct({ id: 'kcl-g-404', sku: 'KCL-G-404', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-404' });
  khadimProduct({ id: 'kcl-g-410-bg', sku: 'KCL-G-410 BG', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-410-bg' });
  khadimProduct({ id: 'kcl-g-451', sku: 'KCL-G-451', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-451' });
  khadimProduct({ id: 'kcl-g-452', sku: 'KCL-G-452', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-452' });
  khadimProduct({ id: 'kcl-g-453', sku: 'KCL-G-453', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-453' });
  khadimProduct({ id: 'kcl-g-455-cr', sku: 'KCL-G-455 CR', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-455-cr' });
  khadimProduct({ id: 'kcl-g-456-g', sku: 'KCL-G-456 G', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-456-g' });
  khadimProduct({ id: 'kcl-g-457-g', sku: 'KCL-G-457 G', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-457-g' });
  khadimProduct({ id: 'kcl-g-458-g', sku: 'KCL-G-458 G', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-458-g' });
  khadimProduct({ id: 'kcl-g-459-g', sku: 'KCL-G-459 G', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-459-g' });
  khadimProduct({ id: 'kcl-g-466-sg', sku: 'KCL-G-466 SG', collection: 'Diseno', tileType: 'Wall', finish: 'Glossy', sourcePath: 'kcl-g-466-sg' });
  khadimProduct({ id: 'kcl-m-442-r1', sku: 'KCL-M-442 R1', collection: 'Diseno', tileType: 'Wall', finish: 'Matt', sourcePath: 'kcl-m-442-r1' });
  khadimProduct({ id: 'kcl-m-492', sku: 'KCL-M-492', collection: 'Diseno', tileType: 'Wall', finish: 'Matt', sourcePath: 'kcl-m-492' });
  khadimProduct({ id: 'kcl-m-493', sku: 'KCL-M-493', collection: 'Diseno', tileType: 'Wall', finish: 'Matt', sourcePath: 'kcl-m-493' });

  /* Khadim Ceramic — Wall & Floor */
  khadimProduct({ id: 'kcl-s-4001', sku: 'KCL-S-4001', collection: 'Odyssey', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-s-4001' });
  khadimProduct({ id: 'kcl-s-4002', sku: 'KCL-S-4002', collection: 'Odyssey', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-s-4002' });
  khadimProduct({ id: 'kcl-s-4003', sku: 'KCL-S-4003', collection: 'Odyssey', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-s-4003' });
  khadimProduct({ id: 'kcl-s-4004', sku: 'KCL-S-4004', collection: 'Odyssey', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-s-4004' });
  khadimProduct({ id: 'kcl-m-481', sku: 'KCL-M-481', collection: 'Diseno', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-481' });
  khadimProduct({ id: 'kcl-m-482-g', sku: 'KCL-M-482 G', collection: 'Diseno', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-482-g' });
  khadimProduct({ id: 'kcl-m-482-gr', sku: 'KCL-M-482 GR', collection: 'Diseno', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-482-gr' });
  khadimProduct({ id: 'kcl-m-484', sku: 'KCL-M-484', collection: '', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-484' });
  khadimProduct({ id: 'kcl-m-485', sku: 'KCL-M-485', collection: 'Diseno', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-485' });
  khadimProduct({ id: 'kcl-m-487', sku: 'KCL-M-487', collection: 'Diseno', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-487' });
  khadimProduct({ id: 'kcl-m-488', sku: 'KCL-M-488', collection: 'Diseno', tileType: 'Wall & Floor', finish: 'Matt', sourcePath: 'kcl-m-488' });

  const orderByBrandGroup = (products) => {
    const grouped = { khadim: [], mir: [], other: [] };
    products.forEach((item) => {
      if (item.brandSlug === 'khadim') grouped.khadim.push(item);
      else if (item.brandSlug === 'mir') grouped.mir.push(item);
      else grouped.other.push(item);
    });
    return grouped.khadim.concat(grouped.mir, grouped.other);
  };

  window.CERAVO_WASHROOM_PRODUCTS = orderByBrandGroup(catalog);
})();
