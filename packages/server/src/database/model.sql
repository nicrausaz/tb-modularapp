CREATE TABLE IF NOT EXISTS Users (
  id INTEGER NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Module (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  version VARCHAR(255) NOT NULL,
  configuration json,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ScreenConfiguration (
  id INTEGER NOT NULL,
  configuration json,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ScreenSlot (
  id INTEGER NOT NULL,
  screenId INTEGER NOT NULL,
  moduleId VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (screenId) REFERENCES ScreenConfiguration(id)
  FOREIGN KEY (moduleId) REFERENCES Module(id)
);