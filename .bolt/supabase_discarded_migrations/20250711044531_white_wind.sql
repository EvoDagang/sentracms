/*
  # Seed Initial Data

  1. Insert sample clients
  2. Insert sample users
  3. Insert sample invoices and payments
  4. Insert sample components and progress steps
  5. Insert sample calendar events and chats
*/

-- Insert sample clients
INSERT INTO clients (id, name, business_name, email, phone, status, pic, total_sales, total_collection, balance, last_activity, invoice_count, registered_at, company, address, notes, username, password) VALUES
(1, 'Ahmad Bin Abdullah', 'Ahmad Tech Solutions Sdn Bhd', 'ahmad.abdullah@gmail.com', '+60 12-345 6789', 'Complete', 'Nisha KB', 25000, 20000, 5000, '2025-01-15', 3, '2025-07-09 10:44:34', 'Ahmad Tech Solutions Sdn Bhd', 'Jalan Bukit Bintang, Kuala Lumpur', 'VIP client with multiple ongoing projects', 'ahmad.abdullah@gmail.com', 'password123'),
(2, 'Siti Nurhaliza Binti Mohd', 'Siti Digital Marketing Sdn Bhd', 'siti.nurhaliza@gmail.com', '+60 13-456 7890', 'Complete', 'Ahmad Razak', 18500, 15000, 3500, '2025-01-14', 2, '2025-06-15 14:20:15', 'Siti Digital Marketing Sdn Bhd', 'Jalan Ampang, Kuala Lumpur', 'Regular client with good payment history', 'siti.nurhaliza@gmail.com', 'password123'),
(3, 'Lim Wei Ming', 'Wei Ming Enterprise Sdn Bhd', 'weiming.lim@gmail.com', '+60 14-567 8901', 'Pending', 'Siti Nurhaliza', 12000, 8000, 4000, '2025-01-13', 1, '2025-08-20 09:30:45', 'Wei Ming Enterprise Sdn Bhd', 'Jalan Petaling, Kuala Lumpur', 'New client, monitoring progress', 'weiming.lim@gmail.com', 'password123'),
(4, 'Raj Kumar A/L Suresh', 'Kumar Digital Agency Sdn Bhd', 'raj.kumar@gmail.com', '+60 15-678 9012', 'Complete', 'Muhammad Hakim', 35000, 30000, 5000, '2025-01-15', 4, '2025-05-10 11:15:30', 'Kumar Digital Agency Sdn Bhd', 'Jalan Klang Lama, Kuala Lumpur', 'Long-term client with excellent relationship', 'raj.kumar@gmail.com', 'password123'),
(5, 'Fatimah Zahra Binti Hassan', 'Zahra Startup Ventures Sdn Bhd', 'fatimah.zahra@gmail.com', '+60 16-789 0123', 'Inactive', 'Fatimah Zahra', 8000, 6000, 2000, '2025-01-10', 1, '2025-09-05 16:45:20', 'Zahra Startup Ventures Sdn Bhd', 'Jalan Tun Razak, Kuala Lumpur', 'Startup client, payment delays', 'fatimah.zahra@gmail.com', 'password123'),
(6, 'Syazwani Binti Jamali', 'Syazwani Tech Solutions Sdn Bhd', 'syazwani@gmail.com', '0193721960', 'Complete', 'Ahmad Razak', 22000, 18000, 4000, '2025-01-12', 3, '2025-07-09 10:44:34', 'Syazwani Tech Solutions Sdn Bhd', 'Jalan Sultanah Zainab, Kota Bharu, Kelantan', 'VIP client with multiple ongoing projects', 'syazwani@gmail.com', 'password123'),
(7, 'Chen Li Hua', 'Li Hua Creative Studio Sdn Bhd', 'chen.lihua@gmail.com', '+60 17-890 1234', 'Inactive', 'Nurul Aina', 15000, 10000, 5000, '2025-01-08', 2, '2025-04-25 13:20:10', 'Li Hua Creative Studio Sdn Bhd', 'Jalan Imbi, Kuala Lumpur', 'Creative agency, project on hold', 'chen.lihua@gmail.com', 'password123');

-- Reset sequence for clients
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));

-- Insert sample invoices
INSERT INTO invoices (id, client_id, package_name, amount, paid, due, status, created_at) VALUES
('INV-001', 1, 'Kuasa 360 Package', 9997, 3000, 6997, 'Partial', '2025-01-10 10:00:00'),
('INV-002', 2, 'Digital Marketing Suite', 18500, 15000, 3500, 'Partial', '2025-01-08 14:30:00'),
('INV-003', 3, 'Basic Web Package', 12000, 8000, 4000, 'Partial', '2025-01-12 09:15:00'),
('INV-004', 4, 'Premium Agency Package', 35000, 30000, 5000, 'Partial', '2025-01-05 11:45:00'),
('INV-005', 5, 'Startup Package', 8000, 6000, 2000, 'Partial', '2025-01-15 16:20:00');

-- Insert sample payments
INSERT INTO payments (id, client_id, invoice_id, amount, payment_source, status, paid_at) VALUES
('PAY-001', 1, 'INV-001', 3000, 'Online Transfer', 'Paid', '2025-01-11 10:30:00'),
('PAY-002', 2, 'INV-002', 15000, 'Online Transfer', 'Paid', '2025-01-09 14:45:00'),
('PAY-003', 3, 'INV-003', 8000, 'Stripe/Razorpay (Payment Gateway)', 'Paid', '2025-01-13 11:20:00'),
('PAY-004', 4, 'INV-004', 30000, 'Online Transfer', 'Paid', '2025-01-06 15:10:00'),
('PAY-005', 5, 'INV-005', 6000, 'Cash', 'Paid', '2025-01-16 09:30:00');

-- Insert sample calendar events
INSERT INTO calendar_events (id, client_id, title, start_date, end_date, start_time, end_time, description, type) VALUES
('event-1', 1, 'Client Meeting - Ahmad Tech Solutions', '2025-01-20', '2025-01-20', '10:00', '11:00', 'Project kickoff meeting', 'meeting'),
('event-2', 2, 'Payment Due - Siti Digital Marketing', '2025-01-22', '2025-01-22', '11:30', '12:00', 'Final payment for digital marketing package', 'payment'),
('event-3', 3, 'Project Deadline - Wei Ming Enterprise', '2025-01-25', '2025-01-25', '17:00', '17:30', 'Website development deliverables', 'deadline'),
('event-4', 4, 'Follow-up Call - Kumar Digital Agency', '2025-01-28', '2025-01-28', '14:00', '14:30', 'Progress review call', 'call');

-- Insert sample components
INSERT INTO components (id, client_id, name, price, active) VALUES
('comp-1', 1, 'Akses 12 Month Sistem Kuasa', 'RM 299.00', true),
('comp-2', 1, 'Akses 12 Month Sistem Telah AI', 'RM 199.00', true),
('comp-3', 1, 'Executive Kuasa Workshop', 'RM 499.00', false),
('comp-4', 2, 'Digital Marketing Suite Pro', 'RM 599.00', true),
('comp-5', 2, 'Social Media Management', 'RM 299.00', true),
('comp-6', 3, 'Basic Website Package', 'RM 399.00', true),
('comp-7', 3, 'SEO Optimization', 'RM 199.00', false),
('comp-8', 4, 'Premium Agency Package', 'RM 999.00', true),
('comp-9', 4, 'Brand Development', 'RM 699.00', true),
('comp-10', 4, 'Content Creation Suite', 'RM 399.00', true);

-- Insert sample progress steps
INSERT INTO progress_steps (id, client_id, title, description, deadline, completed, completed_date, important) VALUES
('step-1', 1, 'Akses 12 Month Sistem Kuasa', 'Complete setup and configuration for Akses 12 Month Sistem Kuasa', '2025-01-25 10:00:00', true, '2025-01-20', true),
('step-2', 1, 'Akses 12 Month Sistem Telah AI', 'Complete setup and configuration for Akses 12 Month Sistem Telah AI', '2025-01-30 10:00:00', false, null, false),
('step-2a', 1, 'Executive Kuasa Workshop', 'Complete setup and configuration for Executive Kuasa Workshop', '2025-02-05 10:00:00', false, null, false),
('step-3', 2, 'Digital Marketing Suite Pro', 'Complete setup and configuration for Digital Marketing Suite Pro', '2025-01-28 15:00:00', true, '2025-01-25', true),
('step-4', 2, 'Social Media Management', 'Complete setup and configuration for Social Media Management', '2025-02-05 12:00:00', false, null, false),
('step-5', 3, 'Basic Website Package', 'Complete setup and configuration for Basic Website Package', '2025-02-10 14:00:00', false, null, true),
('step-6', 3, 'SEO Optimization', 'Complete setup and configuration for SEO Optimization', '2025-02-15 16:00:00', false, null, false),
('step-7', 4, 'Premium Agency Package', 'Complete setup and configuration for Premium Agency Package', '2025-02-01 10:00:00', true, '2025-01-28', true),
('step-8', 4, 'Brand Development', 'Complete setup and configuration for Brand Development', '2025-02-08 12:00:00', false, null, false),
('step-9', 4, 'Content Creation Suite', 'Complete setup and configuration for Content Creation Suite', '2025-02-12 15:00:00', false, null, false);

-- Insert sample progress step comments
INSERT INTO progress_step_comments (id, step_id, text, username, created_at) VALUES
('comment-1', 'step-1', 'Component has been successfully configured and activated', 'Ahmad Razak', '2025-01-20 09:30:00'),
('comment-2', 'step-2', 'Waiting for client to provide AI system requirements', 'Nisha KB', '2025-01-22 14:20:00');

-- Insert sample chats
INSERT INTO chats (id, client_id, client_name, avatar, last_message, last_message_at, unread_count, online) VALUES
(1, 1, 'Ahmad Tech Solutions', 'AT', 'Terima kasih untuk update projek ini', '2025-01-15 10:30:00', 2, true),
(2, 2, 'Siti Digital Marketing', 'SD', 'Bila boleh schedule meeting seterusnya?', '2025-01-15 09:15:00', 0, false),
(3, 3, 'Wei Ming Enterprise', 'WM', 'Design nampak bagus!', '2025-01-14 16:00:00', 1, true),
(4, 4, 'Kumar Digital Agency', 'KD', 'Payment sudah diproses', '2025-01-13 14:00:00', 0, false);

-- Reset sequence for chats
SELECT setval('chats_id_seq', (SELECT MAX(id) FROM chats));

-- Insert sample chat messages
INSERT INTO chat_messages (chat_id, sender, content, created_at) VALUES
(1, 'client', 'Hi! Saya nak check progress projek kami.', '2025-01-15 10:15:00'),
(1, 'admin', 'Hello! Projek berjalan dengan baik. Kami sudah complete design phase dan sekarang moving ke development.', '2025-01-15 10:18:00'),
(1, 'client', 'Bagus! Boleh share beberapa screenshots?', '2025-01-15 10:20:00'),
(1, 'admin', 'Tentu! Saya akan hantar sebentar lagi. UI nampak sangat clean dan modern.', '2025-01-15 10:22:00'),
(1, 'client', 'Terima kasih untuk update projek ini', '2025-01-15 10:30:00'),
(2, 'client', 'Bila boleh schedule meeting seterusnya?', '2025-01-15 09:15:00'),
(3, 'client', 'Design nampak bagus!', '2025-01-14 16:00:00'),
(4, 'client', 'Payment sudah diproses', '2025-01-13 14:00:00');