/*
 Default database values for a new installation
 */
INSERT
  OR REPLACE INTO Users (id, username, password, isDefault)
VALUES
  (
    1,
    'admin',
    '$argon2id$v=19$m=65536,t=3,p=4$Lvfbv1xfbqoboSBAbi8iYw$yFOEWWz3TRnJ6S1TvVW6AJ4VnG7t3gwj5VnxXiRKDTc',
    1
  );

INSERT
  OR REPLACE INTO Screens (id, name)
VALUES
  (1, 'Default screen');

INSERT
  OR REPLACE INTO Box (name, version, icon)
VALUES
  ('Modular APP', '1.0.0', 'logo.svg');