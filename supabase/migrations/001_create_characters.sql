-- bewithyou: characters 表，与 Clerk 用户关联
create table if not exists public.characters (
  id text primary key,
  clerk_user_id text not null,
  name text not null,
  avatar_url text not null default '',
  voice_id text not null default '',
  description text,
  is_public boolean not null default false,
  status text not null default 'ready' check (status in ('cloning', 'ready')),
  creator_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_characters_clerk_user_id on public.characters (clerk_user_id);
create index if not exists idx_characters_is_public on public.characters (is_public) where is_public = true;

comment on table public.characters is '用户创建的声音克隆角色，clerk_user_id 对应 Clerk 用户 ID';

-- 可选：RLS。若使用 Clerk JWT 与 Supabase 集成，可启用以下策略
-- alter table public.characters enable row level security;
-- create policy "Users can manage own characters"
--   on public.characters for all
--   using (clerk_user_id = auth.jwt() ->> 'sub');
