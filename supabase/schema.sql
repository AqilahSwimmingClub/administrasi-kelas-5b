create table if not exists public.class_app_data (
  class_id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.class_app_data enable row level security;

drop policy if exists "class data readable" on public.class_app_data;
create policy "class data readable" on public.class_app_data
for select using (true);

drop policy if exists "class data insertable" on public.class_app_data;
create policy "class data insertable" on public.class_app_data
for insert with check (true);

drop policy if exists "class data updatable" on public.class_app_data;
create policy "class data updatable" on public.class_app_data
for update using (true) with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'class_app_data'
  ) then
    alter publication supabase_realtime add table public.class_app_data;
  end if;
end
$$;
