-- Create tables

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  timezone TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE event_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  region_id INTEGER REFERENCES regions(id),
  event_type_id INTEGER REFERENCES event_types(id),
  is_holiday BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE holidays (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  region_id INTEGER REFERENCES regions(id),
  type TEXT NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_date DATE,
  confidence_score REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  region_id INTEGER REFERENCES regions(id),
  event_type_id INTEGER REFERENCES event_types(id),
  reasoning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Insert initial data

INSERT INTO event_types (id, name, color, icon) VALUES
(1, '节假日事件', 'red', 'tag'),
(2, '营销活动', 'blue', 'campaign'),
(3, '自定义事件', 'green', 'event');

INSERT INTO regions (name, code, timezone) VALUES
('China', 'CN', 'Asia/Shanghai'),
('United States', 'US', 'America/New_York'),
('Canada', 'CA', 'America/Toronto'),
('Europe', 'EU', 'Europe/Brussels'),
('Japan', 'JP', 'Asia/Tokyo'),
('South Korea', 'KR', 'Asia/Seoul'),
('Vietnam', 'VN', 'Asia/Ho_Chi_Minh'),
('Indonesia', 'ID', 'Asia/Jakarta'),
('Thailand', 'TH', 'Asia/Bangkok'),
('Brazil', 'BR', 'America/Sao_Paulo'),
('Argentina', 'AR', 'America/Argentina/Buenos_Aires'),
('Mexico', 'MX', 'America/Mexico_City');

-- Note: Holiday data needs to be populated. This is just a sample structure.
-- You would add INSERT statements for holidays for each region here.
-- Example for China:
INSERT INTO holidays (name, date, region_id, type) VALUES
('New Year''s Day', '2024-01-01', 1, 'national'),
('Spring Festival', '2024-02-10', 1, 'national'),
('Qingming Festival', '2024-04-04', 1, 'national');

-- Example for United States:
INSERT INTO holidays (name, date, region_id, type) VALUES
('New Year''s Day', '2024-01-01', 2, 'national'),
('Martin Luther King, Jr. Day', '2024-01-15', 2, 'national'),
('Presidents'' Day', '2024-02-19', 2, 'national');

-- Enable Row Level Security for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Allow all users to see all events" ON events FOR SELECT
USING (true);

CREATE POLICY "Allow all users to create events" ON events FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all users to update events" ON events FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all users to delete events" ON events;

CREATE POLICY "Allow all users to delete events" ON events FOR DELETE
USING (true);