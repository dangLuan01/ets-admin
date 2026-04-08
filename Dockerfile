# STAGE 1: Cài đặt dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy các file lock của package manager
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Cài đặt dependencies dựa trên file lock tìm thấy
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    else npm install; fi

# STAGE 2: Build ứng dụng
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies đã được cài đặt từ stage 'deps'
COPY --from=deps /app/node_modules ./node_modules
# Copy toàn bộ source code
COPY . .

# Build ứng dụng Angular với cấu hình production
RUN npx ng build --configuration=production

# STAGE 3: Chạy ứng dụng
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Cài đặt 'serve' - một server static đơn giản
RUN npm install -g serve

# Copy các file đã được build từ stage 'builder'
COPY --from=builder /app/dist/ets-admin ./

# Expose port 4200
EXPOSE 4200

# Khởi chạy server
# -s: Chế độ single-page app (quan trọng cho Angular routing)
# -l: Lắng nghe trên port 4200
CMD ["serve", "-s", "browser", "-l", "4200"]
