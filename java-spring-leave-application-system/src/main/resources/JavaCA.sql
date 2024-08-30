SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;
-- Delete all rows from the table
DELETE FROM leave_balance;
DELETE FROM leave_records;
DELETE FROM compensation_record;
DELETE FROM users;
DELETE FROM leave_type;
DELETE FROM wphcalendar;

ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE leave_balance AUTO_INCREMENT = 1;
ALTER TABLE compensation_record AUTO_INCREMENT = 1;
ALTER TABLE leave_records AUTO_INCREMENT = 1;
ALTER TABLE leave_type AUTO_INCREMENT = 1;
ALTER TABLE wphcalendar AUTO_INCREMENT = 1;
-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;



INSERT INTO leave_type (administrative_init_balance, granularity, leave_type, professional_init_balance)
VALUES
   (14, 'ONE', 'annual', 18),
   (60, 'ONE', 'medical', 60),
   (0, 'HALF', 'compensation', 0);
   
INSERT INTO users (role, enabled, password, username, designation, email, first_name, last_name, phone_number, staff_id, managed_by_id)
VALUES
    ('manager', b'1', 'Manager1!', 'nusiss2345', 'Professional', 'xxxyoo1916@gmail.com', 'Bob', 'Johnson', '234-567-8901', NULL, NULL),
    ('manager', b'1', 'Manager2!', 'nusiss3456', 'Professional', 'xxxyoo1916@gmail.com', 'Carol', 'Williams', '345-678-9012', NULL, 1);

INSERT INTO users (role, enabled, password, username, designation, email, first_name, last_name, phone_number, staff_id, managed_by_id)
VALUES
    ('staff', b'1', 'Staff123!', 'nusiss4567', 'Professional', 'xuyang_1230@163.com', 'David', 'Brown', '456-789-0123', NULL, 2),
    ('staff', b'1', 'Staff234!', 'nusiss5678', 'Professional', 'xuyang_1230@163.com', 'Eve', 'Jones', '567-890-1234', NULL, 2),
    ('staff', b'1', 'Staff345!', 'nusiss6789', 'Professional', 'xuyang_1230@163.com', 'Frank', 'Garcia', '678-901-2345', NULL, 2),
    ('staff', b'1', 'Staff456!', 'nusiss7890', 'Professional', 'xuyang_1230@163.com', 'Grace', 'Martinez', '789-012-3456', NULL, 2),
    ('staff', b'1', 'Staff567!', 'nusiss8901', 'Professional', 'xuyang_1230@163.com', 'Hank', 'Davis', '890-123-4567', NULL, 2);

INSERT INTO users (role, enabled, password, username, designation, email, first_name, last_name, phone_number, staff_id, managed_by_id)
VALUES
    ('admin',b'1', 'Password1!', 'nusiss1234', NULL,NULL, NULL, NULL, NULL, 3, NULL);


INSERT INTO leave_records (comment, end_date, reason, start_date, status, work_dissenmination, leave_type_leave_code, staff_id)
VALUES
-- Records for January to March
(NULL, '2024-01-10', 'Annual Leave', '2024-01-05', 'approved', 'Work assigned to Bob', 1, 2),
(NULL, '2024-02-15', 'Medical Leave', '2024-02-10', 'approved', 'Work assigned to Eve', 2, 3),
(NULL, '2024-03-20', 'Professional Development', '2024-03-15', 'approved', 'Work assigned to Frank', 1, 4),
('Too many leave requests', '2024-01-20', 'Annual Leave', '2024-01-15', 'rejected', 'Work assigned to David', 1, 5),
('Insufficient leave balance', '2024-02-25', 'Medical Leave', '2024-02-20', 'rejected', 'Work assigned to Grace', 2, 5),
(NULL, '2024-02-28', 'Annual Leave', '2024-02-25', 'approved', 'Work assigned to Ivy', 1, 6),
(NULL, '2024-03-05', 'Medical Leave', '2024-03-01', 'approved', 'Work assigned to Jack', 2, 7),
(NULL, '2024-01-22', 'Professional Development', '2024-01-20', 'approved', 'Work assigned to Hank', 1, 3),
(NULL, '2024-02-10', 'Compensation Leave', '2024-02-10', 'approved', 'Work assigned to Bob', 3, 4),
('Leave request not justified', '2024-03-01', 'Compensation Leave', '2024-03-01', 'rejected', 'Work assigned to Eve', 3, 4),

-- Records for May to June
(NULL, '2024-05-20', 'Annual Leave', '2024-05-15', 'approved', 'Work assigned to Bob', 1, 3),
(NULL, '2024-06-10', 'Medical Leave', '2024-06-09', 'approved', 'Work assigned to Eve', 2, 3),
(NULL, '2024-05-25', 'Professional Development', '2024-05-20', 'approved', 'Work assigned to Frank', 1, 4),
('Insufficient documentation', '2024-05-18', 'Annual Leave', '2024-05-15', 'rejected', 'Work assigned to David', 1, 5),
('Overlap with critical project', '2024-06-10', 'Medical Leave', '2024-06-09', 'rejected', 'Work assigned to Grace', 2, 3),
(NULL, '2024-05-10', 'Annual Leave', '2024-04-15', 'applied', 'Work assigned to Ivy', 1, 4),
(NULL, '2024-06-11', 'Medical Leave', '2024-06-07', 'applied', 'Work assigned to Jack', 2, 3),
(NULL, '2024-05-21', 'Professional Development', '2024-05-20', 'applied', 'Work assigned to Hank', 1, 5),
(NULL, '2024-05-25', 'Compensation Leave', '2024-05-25', 'applied', 'Work assigned to Bob', 3, 4),
('Not eligible for compensation', '2024-06-01', 'Compensation Leave', '2024-06-01', 'rejected', 'Work assigned to Eve', 3, 2),

-- Records from May to July
(NULL, '2024-06-05', 'Annual Leave', '2024-05-25', 'approved', 'Work assigned to Bob', 1, 2),
(NULL, '2024-07-02', 'Annual Leave', '2024-06-25', 'approved', 'Work assigned to Eve', 1, 3),
(NULL, '2024-07-10', 'Annual Leave', '2024-07-01', 'approved', 'Work assigned to Frank', 1, 4),
(NULL, '2024-06-30', 'Annual Leave', '2024-06-15', 'approved', 'Work assigned to David', 1, 5),
(NULL, '2024-07-05', 'Annual Leave', '2024-06-29', 'approved', 'Work assigned to Grace', 1, 2),
(NULL, '2024-06-28', 'Annual Leave', '2024-06-15', 'approved', 'Work assigned to Ivy', 1, 3),
(NULL, '2024-07-15', 'Annual Leave', '2024-07-10', 'approved', 'Work assigned to Jack', 1, 3),
(NULL, '2024-06-20', 'Professional Development', '2024-06-18', 'approved', 'Work assigned to Hank', 1, 3),
(NULL, '2024-06-10', 'Compensation Leave', '2024-06-10', 'approved', 'Work assigned to Bob', 3, 3),
(NULL, '2024-07-01', 'Annual Leave', '2024-07-01', 'approved', 'Work assigned to Eve', 1, 2),

-- Records in 2025
(NULL, '2025-01-05', 'Annual Leave', '2025-02-05', 'approved', 'Work assigned to Bob', 1, 2),
(NULL, '2024-12-28', 'Annual Leave', '2025-01-04', 'approved', 'Work assigned to Eve', 1, 3),
(NULL, '2025-01-01', 'Annual Leave', '2025-01-05', 'approved', 'Work assigned to Frank', 1, 4),
(NULL, '2024-12-25', 'Annual Leave', '2025-01-02', 'approved', 'Work assigned to David', 1, 5);



INSERT INTO leave_balance (current_balance, forward_balance, leave_type_leave_code, staff_id)
VALUES
-- User 1
(18, 8, 1, 1),  -- Annual Leave
(45, 0, 2, 1),  -- Medical Leave
(2, 0, 3, 1),   -- Compensation Leave

-- User 2
(18, 10, 1, 2), -- Annual Leave
(50, 0, 2, 2),  -- Medical Leave
(3, 0, 3, 2),   -- Compensation Leave

-- User 3
(18, 6, 1, 3),  -- Annual Leave
(30, 0, 2, 3),  -- Medical Leave
(1, 0, 3, 3),   -- Compensation Leave

-- User 4
(18, 12, 1, 4), -- Annual Leave
(40, 0, 2, 4),  -- Medical Leave
(0, 0, 3, 4),   -- Compensation Leave

-- User 5
(18, 8, 1, 5),  -- Annual Leave
(60, 0, 2, 5),  -- Medical Leave
(0, 0, 3, 5),   -- Compensation Leave

-- User 6
(18, 10, 1, 6), -- Annual Leave
(55, 0, 2, 6),  -- Medical Leave
(1, 0, 3, 6),   -- Compensation Leave

-- User 7
(18, 5, 1, 7),  -- Annual Leave
(20, 0, 2, 7),  -- Medical Leave
(2, 0, 3, 7);   -- Compensation Leave


INSERT INTO compensation_record (claim_date, comment, overtime_date, overtime_hours, reason, status, staff_id)
VALUES
-- Records for User 1
('2024-06-15', 'Worked late to finish project', '2024-06-14', 4, 'Project deadline', 'approved', 3),
('2024-07-10', 'Worked over weekend', '2024-07-08', 6, 'System upgrade', 'applied', 4),

-- Records for User 2
('2024-06-20', 'Extra hours for client meeting', '2024-06-19', 4, 'Client meeting', 'approved', 2),
('2024-07-05', 'Overtime for system maintenance', '2024-07-03', 5, 'System maintenance', 'rejected', 2),

-- Records for User 3
('2024-06-25', 'Worked late on report', '2024-06-24', 4, 'Report preparation', 'approved', 3),
('2024-07-15', 'Weekend work for deployment', '2024-07-13', 7, 'System deployment', 'approved', 3),

-- Records for User 4
('2024-07-01', 'Overtime for emergency bug fix', '2024-06-30', 5, 'Emergency bug fix', 'approved', 4),
('2024-07-20', 'Extra hours for training', '2024-07-18', 10, 'Staff training', 'applied', 4),

-- Records for User 5
('2024-06-28', 'Worked late to meet deadline', '2024-06-27', 3, 'Project deadline', 'rejected', 5),
('2024-07-10', 'Overtime for data migration', '2024-07-09', 6, 'Data migration', 'applied', 5);

