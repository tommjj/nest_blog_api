# BLOG API

## Description

Backend service được xây dựng với **NestJS** theo kiến trúc nhiều lớp (Domain, Service, Repository, Infrastructure, Interface).  
Ứng dụng hỗ trợ các chức năng chính:

- Quản lý người dùng
- Xác thực & phân quyền
- Quản lý blog (CRUD)
- Tìm kiếm blog
- Caching & logging
- Giám sát hệ thống (metrics & dashboards)

---

## 📂 Project Structure

- **Core layer**: Chứa domain model, service, và các port.
- **Infrastructure layer**: Chứa các adapter (SQLite, Cache, Logger, Providers).
- **Interface layer**: Expose API qua HTTP (controllers, DTO, middleware, guards, pipes).
- **Common layer**: Các helper và định nghĩa response chung.

---

## 🚀 Features

- **Authentication & Authorization**
    - JWT authentication (`/auth/signin`)
    - Authorization module cho Blog & User

- **Users**
    - `POST /users` - tạo user
    - `GET /users/:id` - lấy thông tin user
    - `PATCH /users/:id` - cập nhật user

- **Blogs**
    - `POST /blogs` - tạo blog
    - `GET /blogs/:id` - lấy blog theo ID
    - `PATCH /blogs/:id` - cập nhật blog
    - `DELETE /blogs/:id` - xóa blog

- **Search**
    - `GET /search/blogs` - tìm blog theo từ khóa
    - `GET /search/blogs/author/:id` - tìm blog theo tác giả

- **Utilities**
    - `GET /ping` - health check
    - Logging: ghi log hàng ngày trong thư mục `logs/`
    - Cache: hỗ trợ cache layer qua `node-cache` adapter
    - Metrics: `/metrics` endpoint cho Prometheus scrape

---

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/) - Node.js framework
- [SQLite](https://www.sqlite.org/) (qua [Drizzle ORM](https://orm.drizzle.team)) - database
- [Node-Cache](https://github.com/node-cache/node-cache) - caching
- [Pino](https://github.com/pinojs/pino) logging
- [Prometheus](https://prometheus.io/) - metrics collection
- [Grafana](https://grafana.com/) - metrics visualization
- [Jest](https://jestjs.io/) - testing

---

## 📌 TODO

Thêm Swagger API docs

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
