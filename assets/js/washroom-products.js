(function () {
  const unspecified = 'Not specified';
  const BRAND_NAMES = {
    dbl: 'DBL Ceramic',
    fresh: 'Fresh Ceramic',
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

  const brandGroupKey = (item) => {
    const slug = String((item && item.brandSlug) || '').trim().toLowerCase();
    const name = String((item && item.brand) || '').trim().toLowerCase();
    if (slug === 'khadim' || name.includes('khadim')) return 'khadim';
    if (slug === 'mir' || name.includes('mir')) return 'mir';
    return 'other';
  };

  const orderByBrandGroup = (products) => {
    const grouped = { khadim: [], mir: [], other: [] };
    (products || []).forEach((item) => {
      if (!item) return;
      grouped[brandGroupKey(item)].push(item);
    });
    return grouped.khadim.concat(grouped.mir, grouped.other);
  };

  window.CERAVO_WASHROOM_PRODUCTS = orderByBrandGroup(catalog);

  /* Parking catalog — not added to CERAVO_WASHROOM_PRODUCTS so washroom listing stays unchanged. */
  const dblHtFinish = (label) => {
    if (/sugar effect/i.test(label)) return 'Sugar Effect';
    if (/\bgp\b/i.test(label)) return 'GP';
    return unspecified;
  };
  const dblParkingImage = (id, file) => `https://dbl-v2-api.appswind.com/storage/product/${id}/${file}`;
  const dblHtPaver = ({ sku, label, imageId, imageFile }) => {
    const finish = dblHtFinish(label);
    return product({
      id: `dbl-pk-${sku.toLowerCase()}`,
      brandSlug: 'dbl',
      productName: label,
      sku,
      collection: 'High Thickness Tile',
      tileType: 'Floor',
      size: '20 × 20 cm',
      finish,
      surface: finish,
      color: unspecified,
      suitableSpace: 'Parking',
      description: `${sku} is listed by DBL Ceramics on the official sTiles High Thickness Tile collection. The manufacturer states size 20×20 cm (200×200 mm) and that these tiles are for heavy-traffic areas, parking zones and rooftops. Thickness for this HT model is listed as 12 mm. Finish/surface published with the design name: ${finish}.`,
      sourceUrl: 'https://stiles.dblceramics.com/collection/high-thickness-tile',
      sourceLabel: 'DBL Ceramics sTiles product page',
      image: dblParkingImage(imageId, imageFile),
      images: [dblParkingImage(imageId, imageFile)]
    });
  };
  const mirParkingImage = (file) => `https://mirceramic.com/public/upload/${file}`;
  const mirOutdoorFloor = ({ sku, detailsId, size, look, surface, colour, imageFile }) => product({
    id: `mir-pk-${sku.toLowerCase().replace(/\s+/g, '-')}`,
    brandSlug: 'mir',
    productName: sku,
    sku,
    collection: 'Homogeneous Floor',
    tileType: 'Floor',
    size,
    finish: surface,
    surface,
    color: colour,
    effect: look,
    suitableSpace: 'Parking',
    description: `${sku} is listed by MIR Ceramic as a ${size} square ${look.toLowerCase()} homogeneous floor tile in the Outdoors category. Surface: ${surface}. Colour: ${colour}. The technical specification table is labelled Typical Value of Mir Homogeneous Floor.`,
    sourceUrl: `https://mirceramic.com/details/${detailsId}`,
    sourceLabel: 'MIR Ceramic product page',
    image: mirParkingImage(imageFile),
    images: [mirParkingImage(imageFile)]
  });
  const parkingImage = (file) => `https://khadimceramics.com/wp-content/uploads/2024/03/${file}`;
  const khadimPaver = ({ id, sku, productName, color, size, imageFile, sourcePath, facts }) => product({
    id,
    brandSlug: 'khadim',
    productName,
    sku,
    collection: 'Pavers Collection',
    tileType: 'Floor',
    size,
    finish: unspecified,
    surface: unspecified,
    color,
    suitableSpace: 'Parking',
    description: facts,
    sourceUrl: `https://khadimceramics.com/product/${sourcePath}/`,
    sourceLabel: 'Khadim Ceramic product page',
    image: parkingImage(imageFile),
    images: [parkingImage(imageFile)]
  });

  const dblParkingProducts = [
    dblHtPaver({ sku: 'SQ201-HT', label: 'SQ201-HT (Sugar Effect - 12mm)', imageId: 890, imageFile: 'SQ201-HT-(Sugar-Effect---12mm).jpg' }),
    dblHtPaver({ sku: 'SQ202-HT', label: 'SQ202-HT (Sugar Effect - 12mm)', imageId: 894, imageFile: 'SQ202-HT-(Sugar-Effect---12mm).jpg' }),
    dblHtPaver({ sku: 'SQ203-HT', label: 'SQ203-HT (Sugar Effect - 12mm)', imageId: 893, imageFile: 'SQ203-HT-(Sugar-Effect---12mm).jpg' }),
    dblHtPaver({ sku: 'SQ204-HT', label: 'SQ204-HT (Sugar Effect - 12mm)', imageId: 898, imageFile: 'SQ204-HT-(Sugar-Effect---12mm).jpg' }),
    dblHtPaver({ sku: 'SQ301-HT', label: 'SQ301-HT (12mm)', imageId: 896, imageFile: 'SQ301-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQ302-HT', label: 'SQ302-HT (12mm)', imageId: 900, imageFile: 'SQ302-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQ303-HT', label: 'SQ303-HT (12mm)', imageId: 902, imageFile: 'SQ303-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA001-HT', label: 'SQA001-HT (GP-12mm)', imageId: 904, imageFile: 'SQA001-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA002-HT', label: 'SQA002-HT (GP-12mm)', imageId: 906, imageFile: 'SQA002-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA003-HT', label: 'SQA003-HT (GP-12mm)', imageId: 908, imageFile: 'SQA003-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA004-HT', label: 'SQA004-HT (GP-12mm)', imageId: 910, imageFile: 'SQA004-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA005-HT', label: 'SQA005-HT (GP-12mm)', imageId: 912, imageFile: 'SQA005-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA006-HT', label: 'SQA006-HT (GP-12mm)', imageId: 914, imageFile: 'SQA006-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA007-HT', label: 'SQA007-HT (GP-12mm)', imageId: 916, imageFile: 'SQA007-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA008-HT', label: 'SQA008-HT (GP-12mm)', imageId: 920, imageFile: 'SQA008-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA009-HT', label: 'SQA009-HT (GP-12mm)', imageId: 918, imageFile: 'SQA009-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA010-HT', label: 'SQA010-HT (GP-12mm)', imageId: 922, imageFile: 'SQA010-HT-(GP-12mm).jpg' }),
    dblHtPaver({ sku: 'SQA301-HT', label: 'SQA301-HT (12mm)', imageId: 924, imageFile: 'SQA301-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA302-HT', label: 'SQA302-HT (12mm)', imageId: 926, imageFile: 'SQA302-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA303-HT', label: 'SQA303-HT (12mm)', imageId: 928, imageFile: 'SQA303-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA304-HT', label: 'SQA304-HT (12mm)', imageId: 930, imageFile: 'SQA304-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA305-HT', label: 'SQA305-HT (12mm)', imageId: 932, imageFile: 'SQA305-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA306-HT', label: 'SQA306-HT (12mm)', imageId: 934, imageFile: 'SQA306-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA307-HT', label: 'SQA307-HT (12mm)', imageId: 936, imageFile: 'SQA307-HT-(12mm).jpg' }),
    dblHtPaver({ sku: 'SQA308-HT', label: 'SQA308-HT (12mm)', imageId: 938, imageFile: 'SQA308-HT-(12mm).jpg' })
  ];

  const mirParkingProducts = [
    mirOutdoorFloor({ sku: 'G-4409', detailsId: '1101', size: '40 × 40 cm', look: 'Stone', surface: 'Dosing', colour: 'Black', imageFile: '1621919671.jpg' }),
    mirOutdoorFloor({ sku: 'G-4408', detailsId: '1100', size: '40 × 40 cm', look: 'Stone', surface: 'Dosing', colour: 'Black', imageFile: '1621919647.jpg' }),
    mirOutdoorFloor({ sku: 'G-4407', detailsId: '1099', size: '40 × 40 cm', look: 'Stone', surface: 'Dosing', colour: 'Green', imageFile: '1621919599.jpg' }),
    mirOutdoorFloor({ sku: 'G-4405', detailsId: '1098', size: '40 × 40 cm', look: 'Stone', surface: 'Dosing', colour: 'Yellow', imageFile: '1621919567.jpg' }),
    mirOutdoorFloor({ sku: 'G-4404', detailsId: '1097', size: '40 × 40 cm', look: 'Stone', surface: 'Dosing', colour: 'Pink', imageFile: '1621919539.jpg' }),
    mirOutdoorFloor({ sku: 'G-4403', detailsId: '1096', size: '40 × 40 cm', look: 'Stone', surface: 'Dosing', colour: 'Pink', imageFile: '1621919508.jpg' }),
    mirOutdoorFloor({ sku: 'G-6609', detailsId: '1095', size: '60 × 60 cm', look: 'Stone', surface: 'Dosing', colour: 'Black', imageFile: '1621919275.jpg' }),
    mirOutdoorFloor({ sku: 'G-6608', detailsId: '1094', size: '60 × 60 cm', look: 'Stone', surface: 'Dosing', colour: 'Black', imageFile: '1621919246.jpg' }),
    mirOutdoorFloor({ sku: 'G-6607', detailsId: '1093', size: '60 × 60 cm', look: 'Stone', surface: 'Dosing', colour: 'Green', imageFile: '1621919190.jpg' }),
    mirOutdoorFloor({ sku: 'G-3309', detailsId: '1022', size: '30 × 30 cm', look: 'Stone', surface: 'Dosing', colour: 'Black', imageFile: '1621766982.jpg' }),
    mirOutdoorFloor({ sku: 'G-3307', detailsId: '1021', size: '30 × 30 cm', look: 'Stone', surface: 'Dosing', colour: 'Green', imageFile: '1621766926.jpg' }),
    mirOutdoorFloor({ sku: 'G-3306', detailsId: '1020', size: '30 × 30 cm', look: 'Stone', surface: 'Dosing', colour: 'Grey', imageFile: '1621766885.jpg' }),
    mirOutdoorFloor({ sku: 'PP-3300 Y', detailsId: '838', size: '30 × 30 cm', look: 'Color Glaze', surface: 'Matt', colour: 'Yellow', imageFile: '1621676921.jpg' }),
    mirOutdoorFloor({ sku: 'PP-3300 G', detailsId: '837', size: '30 × 30 cm', look: 'Color Glaze', surface: 'Matt', colour: 'Green', imageFile: '1621676879.jpg' })
  ];

  const khadimParkingProducts = [
    khadimPaver({
      id: 'kcl-pk-55-charcoal',
      sku: 'Parking Tile 55',
      productName: 'Parking Tile 55 – Charcoal',
      color: 'Charcoal',
      size: '5 in × 5 in × 0.39 in',
      imageFile: 'CT-R_edit-charcoal.png',
      sourcePath: 'parking-tile-55',
      facts: 'Parking Tile 55 is listed by Khadim Ceramic Limited in the Pavers Collection as a parking tile. The manufacturer states size 5in X 5in X 0.39in, weight 0.42 kg, and colour Charcoal. Finish type is not specified on the product page. A manufacturer SKU code is not published.'
    }),
    khadimPaver({
      id: 'kcl-pk-55-cream',
      sku: 'Parking Tile 55',
      productName: 'Parking Tile 55 – Cream',
      color: 'Cream',
      size: '5 in × 5 in × 0.39 in',
      imageFile: 'CT-R_edit-cream.png',
      sourcePath: 'parking-tile-55',
      facts: 'Parking Tile 55 is listed by Khadim Ceramic Limited in the Pavers Collection as a parking tile. The manufacturer states size 5in X 5in X 0.39in, weight 0.42 kg, and colour Cream. Finish type is not specified on the product page. A manufacturer SKU code is not published.'
    }),
    khadimPaver({
      id: 'kcl-pk-55-pistachio',
      sku: 'Parking Tile 55',
      productName: 'Parking Tile 55 – Pistachio',
      color: 'Pistachio',
      size: '5 in × 5 in × 0.39 in',
      imageFile: 'CT-R_edit-green.png',
      sourcePath: 'parking-tile-55',
      facts: 'Parking Tile 55 is listed by Khadim Ceramic Limited in the Pavers Collection as a parking tile. The manufacturer states size 5in X 5in X 0.39in, weight 0.42 kg, and colour Pistachio. Finish type is not specified on the product page. A manufacturer SKU code is not published.'
    }),
    khadimPaver({
      id: 'kcl-pk-55-silver',
      sku: 'Parking Tile 55',
      productName: 'Parking Tile 55 – Silver',
      color: 'Silver',
      size: '5 in × 5 in × 0.39 in',
      imageFile: 'CT-R_edit-silver.png',
      sourcePath: 'parking-tile-55',
      facts: 'Parking Tile 55 is listed by Khadim Ceramic Limited in the Pavers Collection as a parking tile. The manufacturer states size 5in X 5in X 0.39in, weight 0.42 kg, and colour Silver. Finish type is not specified on the product page. A manufacturer SKU code is not published.'
    }),
    khadimPaver({
      id: 'kcl-pk-klinker',
      sku: 'Klinker Paver',
      productName: 'Klinker Paver',
      color: 'Red',
      size: '8 in × 4 in × 2 in',
      imageFile: 'Klinker-Paver.webp',
      sourcePath: 'klinker-paver',
      facts: 'Klinker Paver is listed by Khadim Ceramic Limited in the Pavers Collection for outdoor load-bearing use including driving porch. The manufacturer states size 8in X 4in X 2in and colour Red. Finish type is not specified on the product page. A manufacturer SKU code is not published.'
    }),
    khadimPaver({
      id: 'kcl-pk-square-l',
      sku: 'Square Paver (L)',
      productName: 'Square Paver (L)',
      color: 'Beige, Black, Grey, Red',
      size: '8 in × 8 in',
      imageFile: 'Paver-plain.webp',
      sourcePath: 'square-paver-l',
      facts: 'Square Paver (L) is listed by Khadim Ceramic Limited in the Pavers Collection for outdoor load-bearing use including driving porch. The manufacturer states size 8in X 8in and colours Beige, Black, Grey, and Red. Separate colour images and a manufacturer SKU code are not published. Finish type is not specified on the product page.'
    }),
    khadimPaver({
      id: 'kcl-pk-ct-6',
      sku: 'CT-6',
      productName: 'CT-6',
      color: 'Beige, Black, Grey, Red',
      size: '8 in × 4 in × 0.65 in',
      imageFile: 'CT-6-Rock-face.webp',
      sourcePath: 'ct-6',
      facts: 'CT-6 is listed by Khadim Ceramic Limited in the Pavers Collection for outdoor load-bearing use including driving porch. The manufacturer states size 8in X 4in X 0.65in, weight 1.10 kg, and colours Beige, Black, Grey, and Red. Colour variants share the published product image. Finish type is not specified on the product page. A manufacturer SKU code is not published.'
    })
  ];

  window.CERAVO_PARKING_PRODUCTS = dblParkingProducts.concat(mirParkingProducts, khadimParkingProducts);
})();
