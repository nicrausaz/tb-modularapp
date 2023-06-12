CREATE TABLE IF NOT EXISTS Box (
  name VARCHAR(255) NOT NULL DEFAULT 'ComposeBox',
  version VARCHAR(255) NOT NULL DEFAULT '1.0.0'
);

CREATE TABLE IF NOT EXISTS Users (
  id INTEGER NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Modules (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  description VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  version VARCHAR(255) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT 0,
  imported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  configuration json,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Screens (
  id INTEGER NOT NULL,
  name VARCHAR(255),
  enabled BOOLEAN NOT NULL DEFAULT 1,
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

CREATE TABLE IF NOT EXISTS APIKeys (
  key VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (key)
);