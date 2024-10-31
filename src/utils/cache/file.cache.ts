import fs from 'fs'
import path from 'path'

class FileCache {
    private cacheDir: string;

    constructor(cacheDir='./.cache') {
        this.cacheDir = cacheDir
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir);
        }
    }

    // Method to get cached data
  get(key: string) {
    const filePath = path.join(this.cacheDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return null; // Return null if cache does not exist
  }

  // Method to set cache data
  set(key: string, value: any) {
    const filePath = path.join(this.cacheDir, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(value), 'utf-8');
  }

  // Method to clear cache
  clear(key: string) {
    const filePath = path.join(this.cacheDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Method to clear all cache
  clearAll() {
    const files = fs.readdirSync(this.cacheDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(this.cacheDir, file));
    });
  }
}

const fileCache = new FileCache();
export default fileCache;