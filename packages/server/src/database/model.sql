CREATE TABLE IF NOT EXISTS Users (
  id INTEGER NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Modules (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  version VARCHAR(255) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT 0,
  configuration json,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Screen (
  id INTEGER NOT NULL,
  name VARCHAR(255),
  -- configuration json,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ScreenSlots (
  id INTEGER NOT NULL,
  screenId INTEGER NOT NULL,
  moduleId VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (screenId) REFERENCES ScreenConfiguration(id)
  FOREIGN KEY (moduleId) REFERENCES Module(id)
);