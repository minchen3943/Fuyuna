SET SEARCH_PATH = "public";

-- ------------------------------------------------------------------
-- 安装扩展
-- ------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

-- ------------------------------------------------------------------
-- 清理旧表
-- ------------------------------------------------------------------
DO
$$
    BEGIN
        RAISE NOTICE '开始清理旧表结构...';
        DROP TABLE IF EXISTS
            fyn_admin,
            fyn_article,
            fyn_comment,
            fyn_friend_link,
            fyn_data
            CASCADE;
        RAISE NOTICE '旧表清理完成';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION '表清理失败: %', SQLERRM;
            ROLLBACK;
    END
$$;

-- ------------------------------
-- 管理员表
-- ------------------------------
CREATE TABLE fyn_admin
(
    admin_id            SERIAL PRIMARY KEY,
    admin_name          VARCHAR(20) NOT NULL
        CHECK (admin_name ~ '^[a-zA-Z0-9_]{4,20}$'),
    admin_password_hash text        NOT NULL,
    is_active           BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE fyn_admin IS '系统管理员账号表';
COMMENT ON COLUMN fyn_admin.admin_id IS '管理员账号ID';
COMMENT ON COLUMN fyn_admin.admin_name IS '管理员账号名(4-20位)';
COMMENT ON COLUMN fyn_admin.admin_password_hash IS '加密后的密码哈希值';
COMMENT ON COLUMN fyn_admin.is_active IS '是否启用';

-- ------------------------------
-- 文章管理表
-- ------------------------------
CREATE TABLE fyn_article
(
    article_id            SERIAL PRIMARY KEY,
    article_title         TEXT         NOT NULL,
    article_bucket_name   VARCHAR(50)  NOT NULL,
    article_bucket_region VARCHAR(20)  NOT NULL,
    article_key           VARCHAR(500) NOT NULL,
    article_name          VARCHAR(100) NOT NULL,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    article_view_count    INTEGER   DEFAULT 0
        CHECK (article_view_count >= 0),
    article_status        SMALLINT  DEFAULT 0
        CHECK (article_status BETWEEN 0 AND 2)
);
CREATE INDEX idx_article_title ON fyn_article USING GIN (article_title gin_trgm_ops);
COMMENT ON TABLE fyn_article IS '文章基本信息表';
COMMENT ON COLUMN fyn_article.article_id IS '文章ID';
COMMENT ON COLUMN fyn_article.article_title IS '文章标题（5-200字符）';
COMMENT ON COLUMN fyn_article.article_bucket_name IS '云存储桶名称';
COMMENT ON COLUMN fyn_article.article_bucket_region IS '云存储区域代码';
COMMENT ON COLUMN fyn_article.article_key IS '云存储文件key';
COMMENT ON COLUMN fyn_article.article_name IS '前端显示名称';
COMMENT ON COLUMN fyn_article.created_at IS '创建时间';
COMMENT ON COLUMN fyn_article.updated_at IS '最后修改时间';
COMMENT ON COLUMN fyn_article.article_view_count IS '文章浏览量（非负整数）';
COMMENT ON COLUMN fyn_article.article_status IS '状态：0-隐藏 1-公开 2-审核中';

-- ------------------------------
-- 评论表（访客互动信息）
-- ------------------------------
CREATE TABLE fyn_comment
(
    comment_id       SERIAL PRIMARY KEY,
    comment_username VARCHAR(20) NOT NULL,
    comment_email    VARCHAR(255),
    comment_ip       TEXT        NOT NULL,
    comment_content  TEXT        NOT NULL
        CHECK (length(comment_content) BETWEEN 5 AND 2000),
    created_at       TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    comment_status   SMALLINT    NOT NULL DEFAULT 0 CHECK ( comment_status BETWEEN 0 AND 2)
);
COMMENT ON TABLE fyn_comment IS '评论表';
COMMENT ON COLUMN fyn_comment.comment_id IS '评论ID';
COMMENT ON COLUMN fyn_comment.comment_username IS '显示名称';
COMMENT ON COLUMN fyn_comment.comment_email IS '验证邮箱格式';
COMMENT ON COLUMN fyn_comment.comment_ip IS '评论者IP地址';
COMMENT ON COLUMN fyn_comment.comment_content IS '评论内容（5-2000字符）';
COMMENT ON COLUMN fyn_comment.created_at IS '评论时间';
COMMENT ON COLUMN fyn_comment.updated_at IS '最后修改时间';
COMMENT ON COLUMN fyn_comment.comment_status IS '状态：0-隐藏 1-可见 2-异常';

-- ------------------------------
-- 友情链接
-- ------------------------------
CREATE TABLE fyn_friend_link
(
    link_id          SERIAL PRIMARY KEY,
    link_title       VARCHAR(100) NOT NULL,
    link_url         VARCHAR(255) NOT NULL,
    link_image_path  VARCHAR(255),
    link_description TEXT CHECK (length(link_description) <= 100),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link_status      SMALLINT  DEFAULT 1 CHECK ( link_status BETWEEN 0 AND 2)
);
COMMENT ON TABLE fyn_friend_link IS '友情链接管理表';
COMMENT ON COLUMN fyn_friend_link.link_id IS '链接ID';
COMMENT ON COLUMN fyn_friend_link.link_title IS '链接标题';
COMMENT ON COLUMN fyn_friend_link.link_url IS 'URL地址';
COMMENT ON COLUMN fyn_friend_link.link_image_path IS 'LOGO路径';
COMMENT ON COLUMN fyn_friend_link.link_description IS '链接描述（100字符内）';
COMMENT ON COLUMN fyn_friend_link.created_at IS '创建时间';
COMMENT ON COLUMN fyn_friend_link.updated_at IS '最后修改时间';
COMMENT ON COLUMN fyn_friend_link.link_status IS '状态：0-下线 1-展示';

-- ------------------------------
-- 网站统计表
-- ------------------------------
CREATE TABLE fyn_data
(
    visit_count INTEGER   DEFAULT 0 CHECK (visit_count >= 0),
    like_count  INTEGER   DEFAULT 0 CHECK (like_count >= 0),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE fyn_data IS '网站核心统计指标（单行存储）';
COMMENT ON COLUMN fyn_data.visit_count IS '网站总访问量';
COMMENT ON COLUMN fyn_data.like_count IS '累计点赞数';
COMMENT ON COLUMN fyn_data.created_at IS '首次统计时间';
COMMENT ON COLUMN fyn_data.updated_at IS '最后统计时间';

ALTER TABLE fyn_data
    ADD CONSTRAINT chk_single_row CHECK (TRUE);
CREATE UNIQUE INDEX single_row_lock ON fyn_data ((TRUE));

-- ------------------------------
-- 统一更新时间触发器
-- ------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 自动创建触发器
DO
$$
    DECLARE
        tables TEXT[] := ARRAY ['fyn_admin','fyn_article','fyn_comment','fyn_data','fyn_friend_link'];
        tbl    TEXT;
    BEGIN
        FOREACH tbl IN ARRAY tables
            LOOP
                EXECUTE format('CREATE TRIGGER tr_update_%s
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_timestamp()',
                               tbl, tbl);
            END LOOP;
    END
$$;
COMMIT;

-- ------------------------------------------------------------------
-- 部署验证
-- ------------------------------------------------------------------
DO
$$
    DECLARE
        tbl_count INT;
    BEGIN
        -- 验证表结构数量
        SELECT COUNT(*)
        INTO tbl_count
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE';
        IF tbl_count > 0 THEN
            RAISE NOTICE '✅ 数据库架构验证完成，共创建 % 张表', tbl_count;
        ELSE
            RAISE EXCEPTION '❌ 表结构创建失败';
        END IF;
        -- 验证触发器
        IF (SELECT COUNT(*) FROM pg_trigger WHERE tgname LIKE 'tr_update_%') = 5 THEN
            RAISE NOTICE '✅ 时间戳触发器部署成功';
        ELSE
            RAISE EXCEPTION '❌ 触发器配置不完整';
        END IF;
    END
$$;
COMMIT;

-- ------------------------------------------------------------------
-- 初始化admin管理方法
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION admin_add(
    admin_input_name TEXT,
    admin_raw_password TEXT
) RETURNS VOID AS
$$
DECLARE
    "current_user" TEXT := current_user;
BEGIN
    IF current_user NOT IN ('admin_ctrl', 'postgres') THEN
        RAISE EXCEPTION '权限不足';
    END IF;
    INSERT INTO fyn_admin (admin_name,
                           admin_password_hash)
    VALUES (admin_input_name,
            crypt(admin_raw_password, gen_salt('bf', 13)));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
                    SET search_path = public;

-- ------------------------------------------------------------------
-- 管理admin操作用户权限
-- ------------------------------------------------------------------

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1
                       FROM pg_roles
                       WHERE rolname ILIKE 'admin_ctrl') THEN
            CREATE ROLE admin_ctrl WITH NOINHERIT NOLOGIN;
            REVOKE ALL PRIVILEGES ON FUNCTION admin_add FROM PUBLIC;
            GRANT EXECUTE ON FUNCTION admin_add TO admin_ctrl;
            GRANT admin_ctrl TO postgres WITH ADMIN OPTION;
        END IF;
    END
$$;
-- ------------------------------------------------------------------
-- 初始化数据库
-- ------------------------------------------------------------------
-- 初始化统计表数据
INSERT INTO fyn_data (visit_count, like_count)
VALUES (0, 0)
ON CONFLICT DO NOTHING;
-- 创建初始管理员账户
SET ROLE admin_ctrl;
SELECT admin_add('admin', 'admin1234');
SET ROLE postgres;