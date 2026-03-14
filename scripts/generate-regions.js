const fs = require('fs');
const path = require('path');

const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));

// 省份拼音映射
const provinceMap = {
  '北京': 'BJ', '上海': 'SH', '天津': 'TJ', '重庆': 'CQ',
  '河北': 'HE', '山西': 'SX', '辽宁': 'LN', '吉林': 'JL', '黑龙江': 'HLJ',
  '江苏': 'JS', '浙江': 'ZJ', '安徽': 'AH', '福建': 'FJ', '江西': 'JX',
  '山东': 'SD', '河南': 'HA', '湖北': 'HB', '湖南': 'HN', '广东': 'GD',
  '海南': 'HI', '四川': 'SC', '贵州': 'GZ', '云南': 'YN', '陕西': 'SN',
  '甘肃': 'GS', '青海': 'QH', '台湾': 'TW', '内蒙古': 'NM', '广西': 'GX',
  '西藏': 'XZ', '宁夏': 'NX', '新疆': 'XJ', '香港': 'HK', '澳门': 'MO'
};

// 生成数据
const data = cities.map((c, i) => {
  const provCode = provinceMap[c.province] || 'XX';
  const code = `CN-${provCode}-${i.toString().padStart(4, '0')}`;
  return `  { code: "${code}", province: "${c.province}", city: "${c.city}", longitude: ${c.longitude} },`;
});

// 分段输出
const chunkSize = 500;
for (let i = 0; i < data.length; i += chunkSize) {
  const chunk = data.slice(i, i + chunkSize);
  const filename = `regions_part${Math.floor(i / chunkSize) + 1}.txt`;
  fs.writeFileSync(path.join(__dirname, filename), chunk.join('\n'));
}

console.log(`生成了 ${Math.ceil(data.length / chunkSize)} 个文件`);
console.log(`总共 ${data.length} 条数据`);
