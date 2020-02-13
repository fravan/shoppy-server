CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  type INTEGER,
  active BOOLEAN,
  activated_by INTEGER,
  activated_at TIMESTAMP,
  deactivated_by INTEGER,
  deactivated_at TIMESTAMP,
  CONSTRAINT users_pkey
    PRIMARY KEY (id),
  CONSTRAINT users_activated_by_fk 
    FOREIGN KEY (activated_by) REFERENCES users (id),
  CONSTRAINT users_deactivated_by_fk 
    FOREIGN KEY (deactivated_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL,
  name VARCHAR(50) NOT NULL,
  price INTEGER,
  deleted BOOLEAN,
  created_by INTEGER,
  created_at TIMESTAMP,
  CONSTRAINT items_pkey
    PRIMARY KEY (id),
  CONSTRAINT users_created_by_fk
    FOREIGN KEY (created_by) REFERENCES users (id)
);