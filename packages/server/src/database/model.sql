/*
 Define the database structure
 */
/*
 Box represents the application itself
 */
CREATE TABLE IF NOT EXISTS Box (
  name VARCHAR(255) NOT NULL DEFAULT 'ComposeBox',
  version VARCHAR(255) NOT NULL DEFAULT '1.0.0',
  icon VARCHAR(255) DEFAULT NULL
);

/*
 Users represents the people who can access the application
 */
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  isDefault BOOLEAN NOT NULL DEFAULT 0,
  avatar VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

/*
 Module represents the integrations that can be used in the application
 */
CREATE TABLE IF NOT EXISTS Modules (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  description VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  version VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  enabled BOOLEAN NOT NULL DEFAULT 0,
  importedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  configuration json,
  PRIMARY KEY (id)
);

/*
 Screen represents a view containing multiple module renders in the form of a grid
 */
CREATE TABLE IF NOT EXISTS Screens (
  id INTEGER NOT NULL,
  name VARCHAR(255),
  enabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
);

/*
 ScreenSlots represents a cell on the screen grid
 */
CREATE TABLE IF NOT EXISTS ScreenSlots (
  id VARCHAR(20) NOT NULL,
  screenId INTEGER NOT NULL,
  moduleId VARCHAR(255) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (screenId) REFERENCES ScreenConfiguration(id),
  FOREIGN KEY (moduleId) REFERENCES Module(id)
);

/*
 APIKeys represents the keys that can be used to access the API
 */
CREATE TABLE IF NOT EXISTS APIKeys (
  id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL,
  display VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);