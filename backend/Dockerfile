FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento para rodar o build do TypeScript)
RUN npm install

# Copia todo o código fonte e configurações (incluindo tsconfig)
COPY . .

# Faz a compilação do TypeScript
RUN npm run build

EXPOSE 4000

# Executa o comando de produção mapeado no package.json ("node build/src/index.js")
CMD ["npm", "start"]
