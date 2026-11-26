

CREATE TABLE users (
user_id INT PRIMARY KEY NOT NULL,
username TEXT NOT NULL,
passwordHash VARCHAR(255)
);

CREATE TABLE settings (
user_id INT PRIMARY KEY,
FOREIGN KEY (user_id) REFERENCES users(user_id),
theme_id INT NOT NULL,
isProfilePrivate BIT
);

CREATE TABLE feathers (
feather_id INT PRIMARY KEY,
user_id INT,
FOREIGN KEY (user_id) REFERENCES users(user_id),
feather_content TEXT NOT NULL
);

CREATE TABLE comments (
PRIMARY KEY (feather_id, comment_id),
comment_content TEXT NOT NULL,
sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
user_id INT,
friend_id INT,
PRIMARY KEY (user_id, friend_id),
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (friend_id) REFERENCES users(user_id),
CHECK (user_id < friend_id)
);

-- FRIEND REQUESTS ?????

-- similar to friends, but does NOT assert an order of IDs
-- this is vital to check if both users have accepted the friend request

-- check to see if there are two entries with user_id, friend_id
-- if there are, remove both entries and add to the friends table
-- on friend request menu display the first five results w/ only one-way

CREATE TABLE friend_requests (
user_id INT,
friend_id INT,
sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (user_id, friend_id),
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (friend_id) REFERENCES users(user_id)
);

CREATE TABLE threads (
thread_id INT PRIMARY KEY,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thread_members (
thread_id INT,
user_id INT,
PRIMARY KEY (thread_id, user_id),
FOREIGN KEY (thread_id) REFERENCES threads(thread_id),
FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
thread_id INT,
user_id INT,
message_id INT,
PRIMARY KEY (thread_id, message_id),
FOREIGN KEY (thread_id) REFERENCES threads(thread_id),
-- iv is used for aes w/ cryptojs btw
iv INT,
-- maybe encrypt this ????????????
message_content TEXT,
sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

