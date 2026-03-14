const fs = require('fs');
const path = require('path');

// 读取转换后的 UTF-8 文件
const citiesPath = path.join(__dirname, 'cities_utf8.txt');
const content = fs.readFileSync(citiesPath, 'utf8');

const lines = content.split(/\r?\n/).filter(line =>
  line.trim() && !line.startsWith('#') && line.includes('|')
);

const cities = [];
const seen = new Set();

for (const line of lines) {
  const parts = line.split('|').map(p => p.trim());
  if (parts.length < 4) continue;

  const [location, city, lon, lat] = parts;
  const longitude = parseFloat(lon);

  if (isNaN(longitude)) continue;

  // 解析省份和城市
  let province, cityName;
  if (location.includes(' ')) {
    const [country, prov] = location.split(' ');
    province = prov;
    cityName = city;
  } else {
    // 直辖市
    province = city;
    cityName = city;
  }

  const key = `${province}-${cityName}`;
  if (seen.has(key)) continue;
  seen.add(key);

  cities.push({ province, city: cityName, longitude });
}

console.log(`解析到 ${cities.length} 个城市`);
console.log('前 10 个城市：');
cities.slice(0, 10).forEach(c => console.log(c));

// 保存为 JSON
fs.writeFileSync(
  path.join(__dirname, 'cities.json'),
  JSON.stringify(cities, null, 2)
);
