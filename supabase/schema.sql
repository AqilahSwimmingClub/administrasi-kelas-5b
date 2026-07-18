create table if not exists public.class_app_data (
  class_id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.class_app_data enable row level security;

-- Versi sederhana untuk satu kelas. Untuk produksi, gunakan Supabase Auth dan kebijakan per pengguna.
create policy "class data readable" on public.class_app_data
for select using (true);

create policy "class data insertable" on public.class_app_data
for insert with check (true);

create policy "class data updatable" on public.class_app_data
for update using (true) with check (true);

alter publication supabase_realtime add table public.class_app_data;
