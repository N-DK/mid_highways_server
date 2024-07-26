const fs = require('fs');
const path = require('path');

async function importData(Model, jsonFilePath) {
    try {
        // Đọc dữ liệu từ tệp JSON
        const filePath = path.resolve(__dirname, jsonFilePath);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log('LOADING');
        // Chèn dữ liệu vào cơ sở dữ liệu
        const result = await Model.insertMany(data);
        console.log('LOADED');

        return result;
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
}

module.exports = { importData };
