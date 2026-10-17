import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function adminPersistencePlugin(): Plugin {
  return {
    name: 'admin-persistence-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/save-store-data') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const dataPath = path.resolve(__dirname, 'src/data/persistedStoreData.json');
              let existing: Record<string, any> = {};
              if (fs.existsSync(dataPath)) {
                try {
                  existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                } catch {
                  existing = {};
                }
              }
              const merged = { ...existing, ...data };
              fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err?.message || 'Failed to save' }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/get-store-data') && req.method === 'GET') {
          const dataPath = path.resolve(__dirname, 'src/data/persistedStoreData.json');
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(dataPath)) {
            const content = fs.readFileSync(dataPath, 'utf-8');
            res.end(content);
          } else {
            res.end(JSON.stringify(null));
          }
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), adminPersistencePlugin()],
  server: {
    host: true,
    port: 4001,
    open: false,
    watch: {
      ignored: ['**/src/data/persistedStoreData.json']
    }
  }
});

