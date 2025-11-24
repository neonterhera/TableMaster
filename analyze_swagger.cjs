const fs = require('fs');

try {
    // Try reading as utf-8 first
    let content = fs.readFileSync('swagger.json', 'utf8');

    // If it looks like garbage (null bytes), try utf-16le
    if (content.indexOf('\u0000') !== -1) {
        content = fs.readFileSync('swagger.json', 'utf16le');
    }

    // Strip BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    const swagger = JSON.parse(content);
    console.log('Swagger Version:', swagger.swagger || swagger.openapi);
    console.log('Base Path:', swagger.basePath);

    const paths = [];
    Object.keys(swagger.paths).forEach(path => {
        if (path.toLowerCase().includes('booking')) {
            paths.push(path);
        }
    });
    fs.writeFileSync('swagger_paths.txt', paths.join('\n'));
    console.log('Paths written to swagger_paths.txt');

} catch (e) {
    console.error('Error parsing swagger:', e.message);
}
