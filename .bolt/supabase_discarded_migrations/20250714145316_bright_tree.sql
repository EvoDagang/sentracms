/*
  # Create Application Database Tables

  1. New Tables
    - `clients` - Client information and business details
    - `invoices` - Invoice records linked to clients
    - `payments` - Payment records linked to invoices and clients
    - `components` - Package components linked to clients and invoices
    - `progress_steps` - Project progress tracking for clients
    - `calendar_events` - Calendar events and appointments
    - `chats` - Chat conversations with clients
    - `chat_messages` - Individual messages in chat conversations
    - `tags` - Global tags for categorizing clients

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Client users can only access their own data
    - Admin and Team users can access all data

  3. Relationships
    - Foreign key constraints between related tables
    - Proper indexing for performance
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Complete', 'Pending', 'Inactive')),
  package_name TEXT,
  tags TEXT[] DEFAULT '{}',
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_collection DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0,
  last_activity DATE DEFAULT CURRENT_DATE,
  invoice_count INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT now(),
  company TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT 'INV-' || extract(epoch from now())::text,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  due DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Partial', 'Paid', 'Overdue')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT 'PAY-' || extract(epoch from now())::text,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_source TEXT NOT NULL DEFAULT 'Online Transfer',
  status TEXT NOT NULL DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
  paid_at TIMESTAMPTZ DEFAULT now(),
  receipt_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create components table
CREATE TABLE IF NOT EXISTS components (
  id TEXT PRIMARY KEY DEFAULT 'comp-' || extract(epoch from now())::text,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price TEXT DEFAULT 'RM 0',
  active BOOLEAN DEFAULT true,
  invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create progress_steps table
CREATE TABLE IF NOT EXISTS progress_steps (
  id TEXT PRIMARY KEY DEFAULT 'step-' || extract(epoch from now())::text,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_date DATE,
  important BOOLEAN DEFAULT false,
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY DEFAULT 'event-' || extract(epoch from now())::text,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'meeting' CHECK (type IN ('meeting', 'call', 'deadline', 'payment')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  online BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  chat_id BIGINT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'admin', 'team')),
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY DEFAULT 'tag-' || extract(epoch from now())::text,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_components_client_id ON components(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_steps_client_id ON progress_steps(client_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_client_id ON calendar_events(client_id);
CREATE INDEX IF NOT EXISTS idx_chats_client_id ON chats(client_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Super Admin and Team can access all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can only access their own client data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = clients.id
    )
  );

-- RLS Policies for invoices table
CREATE POLICY "Admin and Team can access all invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can only access their invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = invoices.client_id
    )
  );

-- RLS Policies for payments table
CREATE POLICY "Admin and Team can access all payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can only access their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = payments.client_id
    )
  );

-- RLS Policies for components table
CREATE POLICY "Admin and Team can access all components"
  ON components
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can only access their components"
  ON components
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = components.client_id
    )
  );

-- RLS Policies for progress_steps table
CREATE POLICY "Admin and Team can access all progress steps"
  ON progress_steps
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can access their progress steps"
  ON progress_steps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = progress_steps.client_id
    )
  );

-- RLS Policies for calendar_events table
CREATE POLICY "Admin and Team can access all calendar events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can only access their calendar events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = calendar_events.client_id
    )
  );

-- RLS Policies for chats table
CREATE POLICY "Admin and Team can access all chats"
  ON chats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can only access their chats"
  ON chats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND user_profiles.client_id = chats.client_id
    )
  );

-- RLS Policies for chat_messages table
CREATE POLICY "Admin and Team can access all chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can access messages from their chats"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      JOIN chats ON chats.client_id = user_profiles.client_id
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
      AND chats.id = chat_messages.chat_id
    )
  );

-- RLS Policies for tags table
CREATE POLICY "Admin and Team can access all tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Super Admin', 'Team')
    )
  );

CREATE POLICY "Client users can read tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('Client Admin', 'Client Team')
    )
  );

-- Create functions to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_steps_updated_at BEFORE UPDATE ON progress_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update invoice totals when payments change
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update invoice paid and due amounts
  UPDATE invoices 
  SET 
    paid = COALESCE((
      SELECT SUM(amount) 
      FROM payments 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
      AND status = 'Paid'
    ), 0),
    due = amount - COALESCE((
      SELECT SUM(amount) 
      FROM payments 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
      AND status = 'Paid'
    ), 0)
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Update invoice status
  UPDATE invoices 
  SET status = CASE 
    WHEN due <= 0 THEN 'Paid'
    WHEN paid > 0 THEN 'Partial'
    ELSE 'Pending'
  END
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for payment changes
CREATE TRIGGER update_invoice_totals_on_payment_change
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

-- Function to automatically update client totals
CREATE OR REPLACE FUNCTION update_client_totals()
RETURNS TRIGGER AS $$
DECLARE
  target_client_id BIGINT;
BEGIN
  -- Get the client_id from the affected record
  target_client_id := COALESCE(NEW.client_id, OLD.client_id);
  
  -- Update client totals
  UPDATE clients 
  SET 
    total_sales = COALESCE((
      SELECT SUM(amount) 
      FROM invoices 
      WHERE client_id = target_client_id
    ), 0),
    total_collection = COALESCE((
      SELECT SUM(amount) 
      FROM payments 
      WHERE client_id = target_client_id
      AND status = 'Paid'
    ), 0),
    balance = COALESCE((
      SELECT SUM(due) 
      FROM invoices 
      WHERE client_id = target_client_id
    ), 0),
    invoice_count = COALESCE((
      SELECT COUNT(*) 
      FROM invoices 
      WHERE client_id = target_client_id
    ), 0)
  WHERE id = target_client_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for client total updates
CREATE TRIGGER update_client_totals_on_invoice_change
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_client_totals();

CREATE TRIGGER update_client_totals_on_payment_change
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_client_totals();