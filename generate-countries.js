const https = require('https');
const fs = require('fs');

https.get('https://restcountries.com/v3.1/all?fields=cca2,name,idd,region', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const raw = JSON.parse(data);
    const countries = raw.map(c => {
      let code = '';
      if (c.idd && c.idd.root) {
        code = c.idd.root + (c.idd.suffixes && c.idd.suffixes.length > 0 ? c.idd.suffixes[0] : '');
      }
      return {
        isoName: c.cca2,
        name: c.name.common,
        continent: c.region,
        callingCodes: [code]
      };
    }).filter(c => c.callingCodes[0] !== '').sort((a,b) => a.name.localeCompare(b.name));
    
    fs.mkdirSync('/Users/nana/SCEnv/WindsurfIDEnv/e-naturals/web/src/lib', { recursive: true });
    fs.writeFileSync('/Users/nana/SCEnv/WindsurfIDEnv/e-naturals/web/src/lib/countries.json', JSON.stringify(countries, null, 2));
    console.log('Countries generated successfully. Count:', countries.length);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
