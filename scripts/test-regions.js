const { getChinaRegions, findRegionByCode } = require('../dist/index.cjs');

const regions = getChinaRegions();
console.log(`总共 ${regions.length} 个城市`);
console.log('\n前 5 个城市：');
regions.slice(0, 5).forEach(r => {
  console.log(`${r.code}: ${r.name} (经度: ${r.longitude})`);
});

console.log('\n测试查询功能：');
const beijing = findRegionByCode('CN-BJ-0000');
console.log('北京:', beijing);

const shenzhen = regions.find(r => r.city === '深圳');
console.log('深圳:', shenzhen);
