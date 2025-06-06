CREATE TABLE user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_pic TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS survey_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    travel_style TEXT,
    priority TEXT,
    places TEXT,
    purposes TEXT,
    must_go TEXT,
    total_score INTEGER
);

