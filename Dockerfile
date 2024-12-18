
FROM node:18-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# INSTALAR PNPM GLOBALMENTE
RUN npm install -g pnpm
# INSTALAR DEPENDENCIAS
RUN pnpm install --frozen-lockfile --silent
COPY . .
RUN pnpm run build
# EXPONER PUERTO DE LA APLICACION DEL CONTENEDOR, NO EN EL HOST EXPOSE $PORT
# COMANDO PARA EJECUTAR LA APLICACIÓN
CMD ["node", "dist/src/main"]
