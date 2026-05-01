create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  duration_minutes integer not null default 30,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  contact_name text not null,
  contact_phone text not null,
  user_message text not null,
  ai_response text,
  is_converted boolean not null default false,
  is_booking boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages add column if not exists is_converted boolean not null default false;
alter table public.messages add column if not exists is_booking boolean not null default false;

create table if not exists public.ai_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  enabled boolean not null default true,
  personality_prompt text not null default '',
  short_reply_mode boolean not null default true,
  convert_to_sale_mode boolean not null default true,
  business_hours text not null default 'Seg-Sex 08:00 as 18:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.services enable row level security;
alter table public.messages enable row level security;
alter table public.ai_settings enable row level security;

create policy "companies_owner"
on public.companies for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "services_company_owner"
on public.services for all
using (
  exists (
    select 1 from public.companies c
    where c.id = services.company_id and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.companies c
    where c.id = services.company_id and c.user_id = auth.uid()
  )
);

create policy "messages_company_owner"
on public.messages for all
using (
  exists (
    select 1 from public.companies c
    where c.id = messages.company_id and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.companies c
    where c.id = messages.company_id and c.user_id = auth.uid()
  )
);

create policy "ai_settings_company_owner"
on public.ai_settings for all
using (
  exists (
    select 1 from public.companies c
    where c.id = ai_settings.company_id and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.companies c
    where c.id = ai_settings.company_id and c.user_id = auth.uid()
  )
);

create or replace function public.touch_ai_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ai_settings_updated_at on public.ai_settings;
create trigger trg_ai_settings_updated_at
before update on public.ai_settings
for each row execute function public.touch_ai_settings_updated_at();
