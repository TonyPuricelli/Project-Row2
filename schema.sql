DROP DATABASE IF EXISTS user_db;
CREATE DATABASE user_db;

USE use_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  moviedinner_date  VARCHAR(20) NULL,
  zipcode INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO users (moviedineer_date, zipcode)
VALUES ("2018-05-30", 60616);

INSERT INTO users (moviedineer_date, zipcode)
VALUES ("2018-05-31", 60118);

INSERT INTO users (moviedineer_date, zipcode)
VALUES ("2018-05-30", 60626);

INSERT INTO users (moviedineer_date, zipcode)
VALUES ("2018-06-01", 60614);