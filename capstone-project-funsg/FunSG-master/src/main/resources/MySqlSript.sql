
-- Populating the category table
INSERT INTO category (name, ie_tendancy, ns_tendancy, tf_tendancy, jp_tendancy, description)
VALUES
    ('Creative Arts', 1, 0, -1, -1, 'A category focused on artistic and creative pursuits, fostering imagination and expression.'),
    ('Business Tech', 0, 1, 1, 1, 'A category that combines business acumen with technological skills, emphasizing logical thinking and organization.'),
    ('Community Causes', -1, 0, -1, 1, 'A category dedicated to social and community initiatives, promoting empathy and structured efforts for the greater good.'),
    ('Health Lifestyle', 0, -1, -1, -1, 'A category encouraging healthy living and active lifestyles, with a focus on extroversion and sensing.'),
    ('Lifelong Learning', 1, 1, 1, 1, 'A category that promotes continuous education and personal growth, valuing logical reasoning and flexibility.'),
    ('Outdoor Hobbies', -1, -1, 0, -1, 'A category for those who enjoy outdoor activities and hobbies, emphasizing spontaneity and adaptability.');

-- Populating the user table (profileImage is null temporarily)
INSERT INTO user (name, email, password, created_at, ie_tendancy, ns_tendancy, tf_tendancy, jp_tendancy, profile_image_path, status)
VALUES
    ('Alice Johnson', 'alice.johnson@example.com', '$2a$10$pAdLatsYKFFEnHszypkYgO6fZQ0.p5SjnCf0.KcQYGo0ftADItnSW',
     '2024-06-01 10:00:00', 1, 1, -1, 1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/731f74d4-2e35-49b7-94dd-953a4c1763b5_1.jpeg','active'),
    ('Bob Smith', 'bob.smith@example.com', '$2a$10$2dsPvOlgYunQ1FJq2Ox9IejoAzUMNgEs4ZmsZUYvJQmosehx/2InW',
     '2024-06-02 11:00:00', -1, 1, 1, 1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/9ee2974f-6f8c-4a0a-8038-f74e20cfde8f_2.jpeg','active'),
    ('Charlie Brown', 'charlie.brown@example.com', '$2a$10$jCvnVoDA/6yWIkI1ZnzIWOp/FfGDKMzUJ.Ohar6KYlYH89sjLu4Ui',
     '2024-06-03 12:00:00', 1, -1, -1, -1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/c1c3000c-4b6b-4d32-9a33-c3ce4d24bc7b_3.jpg','active'),
    ('Diana Prince', 'diana.prince@example.com', '$2a$10$XBLE0H.QFniXOYShqTrJ1u202tT4GvHXMVS54CP3Pw7RDMMUdiew2',
     '2024-06-04 13:00:00', -1, 1, -1, -1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/821166ef-b2a1-4070-9860-c709dd6ea088_4.png','active'),
    ('Ethan Hunt', 'ethan.hunt@example.com', '$2a$10$wYd4SCvR9GwiKRsavIp2VuAu0W2CNmqGKkuqhH5oNCiE4UOyKORqS',
     '2024-06-05 14:00:00', 1, 1, 1, 1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/82474fa4-8338-4e06-a94b-977846cfef8b_5.jpeg','active'),
    ('Fiona Glenanne', 'fiona.glenanne@example.com', '$2a$10$s3RWCf4IMCe2UHLqr5yMQeN7jRVt0X8OUkSYzg.gqPXwonFkZ4GUy',
     '2024-06-06 15:00:00', -1, -1, -1, 1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/170d364c-47d7-445c-8a51-bf8cba6c5a73_6.jpeg','active'),
    ('George Orwell', 'george.orwell@example.com', '$2a$10$lHCfXi1qUEDbVXphZvbC4.rw0WVC9Vd95JMZAUiequYyvAcdU5gIu',
     '2024-06-07 16:00:00', 1, -1, 1, 1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/9cc422fb-1913-45da-ae82-aa1c1a4fdea9_7.jpeg','active'),
    ('Hannah Abbott', 'hannah.abbott@example.com', '$2a$10$zJR.B6jXYtjoDW4QXQ5IZekvWySp3V9dYJqcFm/mnfKpaW5AxqHnO',
     '2024-06-08 17:00:00', 1, 1, -1, -1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/6a31b6b0-9658-450e-b889-ee06ebfcb6b2_8.jpeg','active'),
    ('Ian Fleming', 'ian.fleming@example.com', '$2a$10$qMSoVYpKtXi..T/9NLeAqepWrQUIR9uumh5Ml1rQqatNzHHXqgV0q',
     '2024-06-09 18:00:00', -1, -1, 1, -1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/e3e8bb49-a881-423a-beed-eb8f8ff16179_9.jpg','active'),
    ('Jane Austen', 'jane.austen@example.com', '$2a$10$jIiXSaPQCun0H55GlW..G.ea7rfd/npC.n1WTQ4ViL0UjeYyVLHLm',
     '2024-06-10 19:00:00', -1, 1, 1, -1,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/b6618658-f7a8-421e-a225-1a2a67e699c4_10.jpeg','active'),
    ('Tom', 'tom@admin.com', '$2a$10$9se/fY7qeoEZVFubnexjWOe.td2aHG2NlX3pzvTeVYVDqWvu95ZQG',
     '2024-06-10 19:00:00', 0, 0, 0, 0,
     'https://funsg.s3.ap-southeast-1.amazonaws.com/UserProfileImage/4c024ea9-8892-4c66-920d-f2929856f1ef_admin-profile.jpg','admin');



-- Populating the interest_group table

-- Creative Arts
INSERT INTO interest_group (name, description, created_at, status, category_id, host_id, profile_image_path)
VALUES
    ('Painting Club', 'Explore various painting techniques and styles.', '2024-07-01 10:00:00', 'active', 1, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/b6d30fce-4473-413a-84cb-5bd653d15cb0_g_painting_club.jpg'),
    ('Photography Enthusiasts', 'Capture moments and improve your photography skills.', '2024-07-02 11:00:00', 'active', 1, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/d39206af-93c7-494b-b184-46387e9d8cf1_g_photography_enthusiasts.jpg'),
    ('Digital Art', 'Create stunning digital artwork and share with others.', '2024-07-03 12:00:00', 'active', 1, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/9ff07b2e-16a4-4b1e-ad25-a3a57863ae2d_g_digital_art.jpg'),
    ('Music Makers', 'Collaborate and create music with fellow enthusiasts.', '2024-07-04 13:00:00', 'active', 1, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/aebad945-9b0c-4f4d-8cf9-ce11fb7451de_g_music_makers.jpg'),
    ('Drama Society', 'Participate in theater productions and acting workshops.', '2024-07-05 14:00:00', 'active', 1, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/53b5f02c-ba02-45be-b143-4e0f970335f2_g_drama_society.jpg');
-- Business Tech
INSERT INTO interest_group (name, description, created_at, status, category_id, host_id, profile_image_path)
VALUES
    ('Startup Incubators', 'Support and grow your startup idea.', '2024-07-11 10:00:00', 'active', 2, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/063c64a3-431c-4f8d-ae02-8dc9df79f6cd_g_startup_incubators.jpg'),
    ('Tech Innovators', 'Explore the latest in technology and innovation.', '2024-07-12 11:00:00', 'active', 2, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/f5a945eb-5a29-4941-8dfe-b426819ffeb9_g_tech_innovators.jpeg'),
    ('Business Strategy', 'Discuss and develop effective business strategies.', '2024-07-13 12:00:00', 'active', 2, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/fda84318-972c-4bd7-888f-1d4e51bfd047_g_business_strategy.jpeg'),
    ('Entrepreneurs Network', 'Connect with other entrepreneurs and share ideas.', '2024-07-14 13:00:00', 'active', 2, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/f085cbc3-f8bd-4dce-8363-5611a2bf1d41_g_entrepreneurs_network.jpeg'),
    ('Coding Bootcamp', 'Learn coding and build tech projects.', '2024-07-15 14:00:00', 'active', 2, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/5273b62d-705f-4876-b476-45ebd567b79c_g_coding_bootcamp.jpg');
-- Community Causes
INSERT INTO interest_group (name, description, created_at, status, category_id, host_id, profile_image_path)
VALUES
    ('Volunteer Network', 'Find and participate in volunteer opportunities.', '2024-07-21 10:00:00', 'active', 3, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/de508a88-9211-4d02-991c-8a8a0ee2ee7d_g_volunteer_network.webp'),
    ('Environmental Action', 'Promote and engage in environmental conservation.', '2024-07-22 11:00:00', 'active', 3, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/3dda77de-7012-49e7-b38f-f4c0587bd0a2_g_enviromental_action.jpeg'),
    ('Animal Welfare', 'Support and advocate for animal rights.', '2024-07-23 12:00:00', 'active', 3, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/dc1f2650-98cd-42b1-ae16-aeddd25f6b56_g_animal_welfare.jpeg'),
    ('Social Justice', 'Discuss and act on social justice issues.', '2024-07-24 13:00:00', 'active', 3, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/%2FGroups/ProfileImage/65c6a964-bd0b-40e3-91de-e53a4a361aed_14.%20%27Social%20Justice%27%2C.webp'),
    ('Youth Mentorship', 'Mentor and support young individuals.', '2024-07-25 14:00:00', 'active', 3, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/2238b228-377f-4409-8f52-ac629c093165_g_youth_mentorship.jpeg');

-- Health Lifestyle
INSERT INTO interest_group (name, description, created_at, status, category_id, host_id, profile_image_path)
VALUES
    ('Fitness Fanatics', 'Join and engage in fitness activities.', '2024-07-01 10:00:00', 'active', 4, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/663efeb2-59ed-4c27-929d-5bf7880e7d4d_g_fitness_fanatics.jpg'),
    ('Healthy Eating', 'Share and learn about healthy eating habits.', '2024-07-02 11:00:00', 'active', 4,2, 'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/8eb2af4c-7152-4b90-9d5e-ce6691ed55b6_g_healthy_eating.jpg'),
    ('Mental Wellness', 'Promote and support mental health.', '2024-07-03 12:00:00', 'active', 4, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/32cdbd04-dbe9-491c-888a-61cc7dbcb4ae_g_mental_wellness.jpeg'),
    ('Yoga and Meditation', 'Practice yoga and meditation with others.', '2024-07-04 13:00:00', 'active', 4, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/128009ff-6c8a-487f-a5e3-8c0c37d1ca90_g_yoga_meditaion.jpg'),
    ('Running Club', 'Join group runs and improve your fitness.', '2024-07-05 14:00:00', 'active', 4, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/75bd3239-1991-4fbc-87f9-40cbda4eba78_g_running_club.jpg');
-- Lifelong Learning
INSERT INTO interest_group (name, description, created_at, status, category_id, host_id, profile_image_path)
VALUES
    ('Book Club', 'Read and discuss books with others.', '2024-07-11 10:00:00', 'active', 5, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/f111dcff-7cd7-433e-b3e8-f59cd2079280_g_book_club.png'),
    ('Language Learners', 'Learn new languages with fellow enthusiasts.', '2024-07-12 11:00:00', 'active', 5, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/43ecb7a0-f730-4337-95cb-7df1a9ec3715_g_language_learners.jpg'),
    ('Science Explorers', 'Explore and discuss scientific topics.', '2024-07-13 12:00:00', 'active', 5, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/8ff9160c-c719-497c-8dfc-2c5bda36908e_g_science_explorers.jpg'),
    ('History Buffs', 'Learn and discuss historical events.', '2024-07-14 13:00:00', 'active', 5, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/b3ce99eb-b077-4200-8b43-07ef912afd1d_g_history_buffs.jpeg'),
    ('Tech Learners', 'Learn about new technologies.', '2024-07-15 14:00:00', 'active', 5, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/8a3ff708-8dfe-419d-9929-f2924aa75d94_g_tech_learners.jpg');
-- Outdoor Hobbies
INSERT INTO interest_group (name, description, created_at, status, category_id, host_id, profile_image_path)
VALUES
    ('Hiking Club', 'Explore hiking trails and enjoy nature.', '2024-07-21 10:00:00', 'active', 6, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/8f736c54-c64c-49b9-8b76-0dc073770170_g_hiking_club.jpg'),
    ('Camping Enthusiasts', 'Organize and participate in camping trips.', '2024-07-22 11:00:00', 'active', 6, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/e10be4e8-d434-4e43-b620-43359b1078b6_g_camping_enthusiasts.jpeg'),
    ('Fishing Fans', 'Join fishing trips and share tips.', '2024-07-23 12:00:00', 'active', 6, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/1a6371c9-eea8-4a94-a7d6-d2abbe9f647a_g_fishing_fans.jpeg'),
    ('Bird Watching', 'Observe and learn about different bird species.', '2024-07-24 13:00:00', 'active', 6, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/57bc73e9-f172-4032-8d9a-6950619cde13_g_bird_watching.jpeg'),
    ('Gardening Group', 'Engage in gardening activities.', '2024-07-25 14:00:00', 'active', 6, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/%2FGroups/ProfileImage/ee5adb44-7809-49d6-b2d4-08c0f7173603_30.%20Gardening%20Group.webp');


-- Populating the event table

-- Creative Arts
INSERT INTO event (name, description, start, end, location, max_participants, created_at, status, group_id, created_by_id, profile_image_path)
VALUES
    ('Painting Workshop', 'Join us for a creative and relaxing painting workshop!', '2024-07-21 10:00:00', '2024-07-21 12:00:00', 'Art Studio 1, 1 Scotts Road, Singapore 228208', 20, '2024-07-01 10:00:00', 'open', 1, 1, 'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/ee4f14b7-7816-40a5-abb1-f654383dbab7_e_painting_workshop.webp'),
    ('Photography Walk', 'Capture the beauty of the city park on a photography walk.', '2024-07-22 10:00:00', '2024-07-22 12:00:00', 'Singapore Botanic Gardens, 1 Cluny Road, Singapore 259569', 15, '2024-07-02 11:00:00', 'open', 2, 2, 'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/084ff9ee-2dd0-4036-afe6-5142c919f11e_2.%20Photography%20Walk.webp'),
    ('Digital Art Class', 'Learn the latest techniques in digital art at our class.', '2024-08-23 14:00:00', '2024-08-23 16:00:00', 'Computer Lab 3, 200 Victoria Street, Singapore 188021', 25, '2024-07-03 12:00:00', 'open', 3, 3, 'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/8552ffc9-5322-4d50-9e92-dcc332f6bcba_e_digital_art_class.jpg'),
    ('Music Jam Session', 'Bring your instruments and jam with fellow music lovers!', '2024-08-24 18:00:00', '2024-08-24 20:00:00', 'Music Room 2, 1 Marina Boulevard, Singapore 018989', 10, '2024-07-04 13:00:00', 'open', 4, 4, 'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/b516f5fe-86cc-424f-8b80-41c5869f2f5b_e_music_jam_session.jpeg'),
    ('Drama Rehearsal', 'Prepare for our upcoming performance in this drama rehearsal.', '2024-09-25 15:00:00', '2024-09-25 17:00:00', 'Auditorium, 100 Orchard Road, Singapore 238840', 30, '2024-07-05 14:00:00', 'open', 5, 5, 'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/d200e8f3-c142-481e-ab01-05386debd80c_e_drama_rehearsal.jpg');


-- Business Tech
INSERT INTO event (name, description, start, end, location, max_participants, created_at, status, group_id, created_by_id, profile_image_path)
VALUES
    ('Startup Pitch', 'Present your startup idea to potential investors.', '2024-07-11 10:00:00', '2024-07-11 12:00:00', 'Singapore Management University, 60 Stamford Road, Singapore 178900', 20, '2024-07-11 10:00:00', 'open', 6, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/32feeba6-6e9d-4ec3-b00c-7eef57e61a10_6.%20Startup%20Pitch.webp'),
    ('Tech Innovation Seminar', 'Discover the latest tech innovations at our seminar.', '2024-07-12 10:00:00', '2024-07-12 12:00:00', 'The Hive, 41 Carpenter Street, Singapore 059921', 30, '2024-07-12 11:00:00', 'open', 7, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/46b72fe8-ce84-4a5a-ad3a-4cfdb9ce6c5f_7.%20Tech%20Innovation%20Seminar.webp'),
    ('Business Strategy Workshop', 'Enhance your business strategy skills in this workshop.', '2024-08-13 14:00:00', '2024-08-13 16:00:00', 'National Design Centre, 111 Middle Road, Singapore 188969', 25, '2024-07-13 12:00:00', 'open', 8, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/3506b61d-c241-41b7-b885-32fff516d2e7_e_business%20strategy_workshop.jpg'),
    ('Entrepreneurs Meetup', 'Network with other entrepreneurs and share your experiences.', '2024-08-14 18:00:00', '2024-08-14 20:00:00', 'The Coffee Academics, 6 Scotts Road, #02-11, Scotts Square, Singapore 228209', 15, '2024-07-14 13:00:00', 'open', 9, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/d632f144-1209-40a8-9082-6722566f86d3_e_entrepreneurs_meetup.jpg'),
    ('Coding Hackathon', 'Join our coding hackathon and show off your programming skills.', '2024-09-15 08:00:00', '2024-09-15 18:00:00', 'Google Singapore, 70 Pasir Panjang Road, Singapore 117371', 50, '2024-07-15 14:00:00', 'open', 10, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/c037439a-7896-4d01-8f9c-b5e9e34684c1_e_coding_hackathon.jpg');


-- Community Causes
INSERT INTO event (name, description, start, end, location, max_participants, created_at, status, group_id, created_by_id, profile_image_path)
VALUES
    ('Community Clean-Up', 'Help clean up our local park and make a difference.', '2024-07-21 09:00:00', '2024-07-21 12:00:00', 'Bishan-Ang Mo Kio Park, 1384 Ang Mo Kio Ave 1, Singapore 569931', 50, '2024-07-21 10:00:00', 'open', 11, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/4d70cc0f-a541-4e5d-9185-0c0c938f1ad1_e_community_cleanup.jpg'),
    ('Tree Planting', 'Contribute to the environment by planting trees in our garden.', '2024-07-22 08:00:00', '2024-07-22 11:00:00', 'East Coast Park, Singapore 449876', 40, '2024-07-22 11:00:00', 'open', 12, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/ae62b758-3990-40c0-898b-7b9007701f5b_g_tree_planting.jpeg'),
    ('Animal Shelter Visit', 'Spend time with animals and help out at the shelter.', '2024-08-23 13:00:00', '2024-08-23 15:00:00', 'SPCA Singapore, 31 Mount Vernon Road, Singapore 368054', 20, '2024-07-23 12:00:00', 'open', 13, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/0aa86db7-b288-44c4-aba1-abc18cb98cd3_e_animal_shelter.jpg'),
    ('Charity Run', 'Join our charity run and support a good cause.', '2024-08-24 07:00:00', '2024-08-24 10:00:00', 'Sentosa, Singapore 098297', 100, '2024-07-24 14:00:00', 'open', 14, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/aae1fc83-9fa3-4d23-968f-d75ff87f634a_e_charity_run.jpg'),
    ('Food Drive', 'Donate non-perishable food items to those in need.', '2024-09-25 09:00:00', '2024-09-25 15:00:00', 'Marina Bay Sands Convention Centre, 10 Bayfront Avenue, Singapore 018956', 60, '2024-07-25 10:00:00', 'open', 15, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/03358863-5dd4-4acf-ac26-4bf73d61973a_e_food_drive.jpg');


-- Health Lifestyle
INSERT INTO event (name, description, start, end, location, max_participants, created_at, status, group_id, created_by_id, profile_image_path)
VALUES
    ('Morning Yoga', 'Start your day with a refreshing yoga session by the beach.', '2024-07-01 07:00:00', '2024-07-01 08:00:00', 'Sentosa Beach, Sentosa Island, Singapore 098270', 20, '2024-07-01 10:00:00', 'open', 16, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/3912dc87-dee3-4f98-839d-80eea63bdd5d_e_morning_yoga.jpeg'),
    ('Healthy Cooking Class', 'Learn to cook healthy meals with our expert chef.', '2024-07-02 10:00:00', '2024-07-02 12:00:00', 'The Soup Spoon, 313 Somerset, 313 Orchard Road, Singapore 238895', 15, '2024-07-02 11:00:00', 'open', 17, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/b018ee5b-689f-4e8d-b537-67d24e08ea3f_17.%20Healthy%20Cooking%20Class.webp'),
    ('Mental Health Workshop', 'Join our workshop to learn about mental health and wellbeing.', '2024-08-03 14:00:00', '2024-08-03 16:00:00', 'Singapore National Library, 100 Victoria Street, Singapore 188064', 30, '2024-07-03 12:00:00', 'open', 18, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/d978f759-c6b8-4b03-99bc-618acb997b9a_18.%20Mental%20Health%20Workshop.webp'),
    ('Meditation Session', 'Relax and unwind with a guided meditation session in the park.', '2024-09-04 18:00:00', '2024-09-04 19:00:00', 'Botanic Gardens, 1 Cluny Road, Singapore 259569', 25, '2024-07-04 13:00:00', 'open', 19, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/f8b50c96-f6cd-412c-95e9-283f983867a3_e_meditation_session.jpeg'),
    ('Evening Run', 'Join us for an invigorating run along the river trail.', '2024-09-05 19:00:00', '2024-09-05 20:00:00', 'Singapore River, Clarke Quay, Singapore 058282', 40, '2024-07-05 14:00:00', 'open', 20, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/8aa27482-d52a-4d5b-9734-774473d7cb01_e_evening_run.png');

-- Lifelong Learning
INSERT INTO event (name, description, start, end, location, max_participants, created_at, status, group_id, created_by_id, profile_image_path)
VALUES
    ('Book Discussion', 'Dive deep into our book of the month with fellow readers.', '2024-07-11 18:00:00', '2024-07-11 20:00:00', 'Central Public Library, 100 Victoria Street, Singapore 188064', 20, '2024-07-11 10:00:00', 'open', 21, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/7c106fca-f36f-4515-81ce-b3c44fcda5ba_21.%20Book%20Discussion.webp'),
    ('Language Exchange', 'Practice and learn new languages in a fun, social setting.', '2024-07-12 17:00:00', '2024-07-12 19:00:00', 'Chatterbox Cafe, 137 Telok Ayer Street, Singapore 068602', 15, '2024-07-12 11:00:00', 'open', 22, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/63d30322-ccf5-4005-bb69-603976a5ec31_22.%20Language%20Exchange.webp'),
    ('Science Talk', 'Explore fascinating science topics with our expert speaker.', '2024-08-13 14:00:00', '2024-08-13 16:00:00', 'Science Centre Singapore, 15 Science Centre Road, Singapore 609081', 30, '2024-07-13 12:00:00', 'open', 23, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/eb468dff-b42c-4735-b19c-9d3510f4216b_e_science_talk.png'),
    ('History Lecture', 'Learn about historical events and their impact in our lecture.', '2024-09-14 10:00:00', '2024-09-14 12:00:00', 'National Museum of Singapore, 93 Stamford Road, Singapore 178897', 40, '2024-07-14 13:00:00', 'open', 24, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/6119f543-5d2f-4a8b-8022-b4f2aa2f27ff_e_history_lecture.jpg'),
    ('Tech Workshop', 'Get hands-on experience with the latest technology at our workshop.', '2024-09-15 09:00:00', '2024-09-15 12:00:00', 'Innovation Lab, 6 Raffles Boulevard, Marina Square, Singapore 039594', 25, '2024-07-15 14:00:00', 'open', 25, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/GroupMedia/1/Events/ProfileImage/0571d89a-9530-44bb-8c62-1771ac79dba7_e_tech_workshop.jpg');


-- Outdoor Hobbies
INSERT INTO event (name, description, start, end, location, max_participants, created_at, status, group_id, created_by_id, profile_image_path)
VALUES
    ('Mountain Hike', 'Enjoy a breathtaking hike through scenic mountain trails.', '2024-07-21 06:00:00', '2024-07-21 10:00:00', 'Bukit Timah Nature Reserve, 177 Peak Road, Singapore 599284', 20, '2024-07-21 10:00:00', 'open', 26, 1,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/04f0039f-6863-42bb-b915-f3a35ac11cc9_26.%20Mountain%20Hike.webp'),
    ('Camping Trip', 'Spend the day camping and exploring the national park.', '2024-07-22 08:00:00', '2024-07-22 18:00:00', 'East Coast Park, 1200 East Coast Parkway, Singapore 468960', 30, '2024-07-22 11:00:00', 'open', 27, 2,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/10895a5d-0b06-41d9-849a-679d58e69f2a_27.%20camp%20trip.jpg'),
    ('Fishing Tournament', 'Compete in our fishing tournament at the lake.', '2024-08-23 05:00:00', '2024-08-23 12:00:00', 'Punggol Waterway Park, 6 Punggol East, Singapore 828824', 25, '2024-07-23 12:00:00', 'open', 28, 3,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/485ff195-4655-4b97-8cc8-0715532a2336_28.fishing.jpg'),
    ('Bird Watching Tour', 'Observe a variety of bird species in their natural habitat.', '2024-08-24 07:00:00', '2024-08-24 10:00:00', 'Sungei Buloh Wetland Reserve, 301 Neo Tiew Crescent, Singapore 718925', 15, '2024-07-24 13:00:00', 'open', 29, 4,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/b25e84a6-acc0-4df6-a126-987607b1a894_29.%20bird%20watch.jpg'),
    ('Gardening Workshop', 'Learn the basics of gardening and plant your own garden.', '2024-08-25 09:00:00', '2024-08-25 11:00:00', 'Singapore Botanic Gardens, 1 Cluny Road, Singapore 259569', 20, '2024-07-25 14:00:00', 'open', 30, 5,'https://funsg.s3.ap-southeast-1.amazonaws.com/EventMedia/%2FEvents/ProfileImage/62fff2fd-1dd6-448b-b267-3bfc62196ac9_30.%20gardening.jpg');

-- Create Comment table
INSERT INTO comment(content, posted_at, group_id, user_id)
VALUES
    ('Amazing Group!','2024-07-21 16:23:00',1,1),
    ('Not Enough!','2024-07-24 16:23:00',1,4),
    ('The host is very nice','2024-07-24 20:13:00',1,6),
    ('Fantastic Group!','2024-07-22 16:23:00',2,2),
    ('Not bad','2024-08-03 16:23:00',2,4),
    ('The events of this group are really appealing','2024-08-05 20:13:00',2,7);

-- Create member records
-- Creative Arts
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-01 10:00:00', 1, 1),
    ('2024-07-02 11:00:00', 2, 2),
    ('2024-07-03 12:00:00', 3, 3),
    ('2024-07-04 13:00:00', 4, 4),
    ('2024-07-05 14:00:00', 5, 5);

-- Business Tech
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-11 10:00:00', 6, 1),
    ('2024-07-12 11:00:00', 7, 2),
    ('2024-07-13 12:00:00', 8, 3),
    ('2024-07-14 13:00:00', 9, 4),
    ('2024-07-15 14:00:00', 10, 5);

-- Community Causes
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-21 10:00:00', 11, 1),
    ('2024-07-22 11:00:00', 12, 2),
    ('2024-07-23 12:00:00', 13, 3),
    ('2024-07-24 13:00:00', 14, 4),
    ('2024-07-25 14:00:00', 15, 5);

-- Health Lifestyle
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-01 10:00:00', 16, 1),
    ('2024-07-02 11:00:00', 17, 2),
    ('2024-07-03 12:00:00', 18, 3),
    ('2024-07-04 13:00:00', 19, 4),
    ('2024-07-05 14:00:00', 20, 5);

-- Lifelong Learning
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-11 10:00:00', 21, 1),
    ('2024-07-12 11:00:00', 22, 2),
    ('2024-07-13 12:00:00', 23, 3),
    ('2024-07-14 13:00:00', 24, 4),
    ('2024-07-15 14:00:00', 25, 5);

-- Outdoor Hobbies
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-21 10:00:00', 26, 1),
    ('2024-07-22 11:00:00', 27, 2),
    ('2024-07-23 12:00:00', 28, 3),
    ('2024-07-24 13:00:00', 29, 4),
    ('2024-07-25 14:00:00', 30, 5);

-- Some users randomly join other groups
INSERT INTO member (joined_at, group_id, user_id)
VALUES
    ('2024-07-01 10:00:00', 1, 6),
    ('2024-07-02 11:00:00', 2, 1),
    ('2024-07-03 12:00:00', 3, 8),
    ('2024-07-04 13:00:00', 4, 3),
    ('2024-07-05 14:00:00', 5, 6),
    ('2024-07-11 10:00:00', 6, 2),
    ('2024-07-12 11:00:00', 7, 8),
    ('2024-07-13 12:00:00', 8, 9),
    ('2024-07-14 13:00:00', 9, 6),
    ('2024-07-15 14:00:00', 10, 7),
    ('2024-07-21 10:00:00', 11, 8),
    ('2024-07-22 11:00:00', 12, 9),
    ('2024-07-23 12:00:00', 13, 4),
    ('2024-07-24 13:00:00', 14, 7),
    ('2024-07-25 14:00:00', 15, 8),
    ('2024-07-01 10:00:00', 16, 9),
    ('2024-07-02 11:00:00', 17, 6),
    ('2024-07-03 12:00:00', 18, 7),
    ('2024-07-04 13:00:00', 19, 8),
    ('2024-07-05 14:00:00', 20, 9),
    ('2024-07-11 10:00:00', 21, 6),
    ('2024-07-12 11:00:00', 22, 7),
    ('2024-07-13 12:00:00', 23, 5),
    ('2024-07-14 13:00:00', 24, 9),
    ('2024-07-15 14:00:00', 25, 6),
    ('2024-07-21 10:00:00', 26, 7),
    ('2024-07-22 11:00:00', 27, 8),
    ('2024-07-23 12:00:00', 28, 9),
    ('2024-07-24 13:00:00', 29, 6),
    ('2024-07-25 14:00:00', 30, 7);

-- create event_participant records
INSERT INTO event_participant (registered_at, event_id, user_id)
VALUES
    ('2024-07-01 09:00:00', 1, 1),
    ('2024-07-02 10:00:00', 2, 2),
    ('2024-07-03 11:00:00', 3, 3),
    ('2024-07-04 12:00:00', 4, 4),
    ('2024-07-05 13:00:00', 5, 5),
    ('2024-07-06 14:00:00', 6, 6),
    ('2024-07-07 15:00:00', 7, 7),
    ('2024-07-08 16:00:00', 8, 8),
    ('2024-07-09 17:00:00', 9, 9),
    ('2024-07-10 18:00:00', 10, 1),
    ('2024-07-11 09:00:00', 11, 2),
    ('2024-07-12 10:00:00', 12, 3),
    ('2024-07-13 11:00:00', 13, 4),
    ('2024-07-14 12:00:00', 14, 5),
    ('2024-07-15 13:00:00', 15, 6),
    ('2024-07-16 14:00:00', 16, 7),
    ('2024-07-17 15:00:00', 17, 8),
    ('2024-07-18 16:00:00', 18, 9),
    ('2024-07-19 17:00:00', 19, 1),
    ('2024-07-20 18:00:00', 20, 2),
    ('2024-07-21 09:00:00', 21, 3),
    ('2024-07-22 10:00:00', 22, 4),
    ('2024-07-23 11:00:00', 23, 5),
    ('2024-07-24 12:00:00', 24, 6),
    ('2024-07-25 13:00:00', 25, 7),
    ('2024-07-26 14:00:00', 26, 8),
    ('2024-07-27 15:00:00', 27, 9),
    ('2024-07-28 16:00:00', 28, 1),
    ('2024-07-29 17:00:00', 29, 2),
    ('2024-07-30 18:00:00', 30, 3);

