
CREATE ROLE user1 WITH LOGIN PASSWORD '1Qwerty!';
ALTER ROLE user1 SUPERUSER;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users
(
    uid         uuid                    NOT NULL    DEFAULT gen_random_uuid(),
    email       character varying(100)  COLLATE pg_catalog."default",
    password    character varying(100)  COLLATE pg_catalog."default",
    nickname    character varying(30)   COLLATE pg_catalog."default",
    CONSTRAINT  users_pkey  PRIMARY KEY (uid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to user1;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tags
(
    id          integer                 NOT NULL    DEFAULT nextval('tags_id_seq'::regclass),
    creator     uuid,
    name        character varying(40)   COLLATE pg_catalog."default",
    sortorder   integer,
    CONSTRAINT  tags_pkey   PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tags
    OWNER to user1;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.usertag
(
    id          integer     NOT NULL    DEFAULT nextval('usertag_id_seq'::regclass),
    user_uid    uuid,
    tag_id      integer,
    CONSTRAINT usertag_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.usertag
    OWNER to user1;