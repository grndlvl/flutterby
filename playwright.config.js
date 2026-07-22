const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({ use: { baseURL: 'http://127.0.0.1:4173' }, reporter: 'list' });
