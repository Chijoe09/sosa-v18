create table if not exists settings(key text primary key, value jsonb not null);
create table if not exists products(
  id text primary key, box text not null, name text not null,
  colours text[] default '{}', sizes text[] default '{}',
  price_pi numeric(18,7) not null, stock int not null default 0,
  images text[] default '{}', updated_at timestamptz default now());
create table if not exists orders(
  id uuid primary key default gen_random_uuid(), seq bigserial,
  items jsonb not null, subtotal numeric(18,7), delivery_method text, delivery_fee numeric(18,7), total numeric(18,7),
  customer_name text, phone text, address text, status text default 'pending',
  payment_id text, txid text, created_at timestamptz default now());
alter table settings enable row level security;
alter table products enable row level security;
alter table orders enable row level security;   -- no policies: only the server (service role) reads/writes
create or replace function decrement_stock(pid text, q int) returns void language sql as
$$ update products set stock = greatest(stock - q, 0) where id = pid $$;
insert into storage.buckets(id,name,public) values('products','products',true) on conflict do nothing;
