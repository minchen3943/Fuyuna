-- ------------------------------------------------------------------
-- 创建数据库
-- ------------------------------------------------------------------
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'fuyuna'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS "fuyuna";

CREATE DATABASE "fuyuna"
    WITH TEMPLATE = template0
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'zh-Hans'
    LC_CTYPE = 'zh-Hans'
    CONNECTION LIMIT = 50
    IS_TEMPLATE = false;
