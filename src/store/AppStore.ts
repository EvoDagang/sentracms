import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Client {
  id: number;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  status: string;
  packageName?: string;
  tags?: string[];
  totalSales: number;
  totalCollection: number;
  balance: number;
  lastActivity: string;
  invoiceCount: number;
  registeredAt: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  clientId: number;
  packageName: string;
  amount: number;
  paid: number;
  due: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  clientId: number;
  invoiceId: string;
  amount: number;
  paymentSource: string;
  status: string;
  paidAt: string;
  receiptFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Component {
  id: string;
  clientId: number;
  name: string;
  price: string;
  active: boolean;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProgressStep {
  id: string;
  clientId: number;
  title: string;
  description?: string;
  deadline: string;
  completed: boolean;
  completedDate?: string;
  important: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
}

interface CalendarEvent {
  id: string;
  clientId: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Chat {
  id: number;
  clientId: number;
  client: string;
  avatar: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unread_count: number;
  online: boolean;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  messageType: string;
  timestamp: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  clientId?: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  // Data
  clients: Client[];
  invoices: Invoice[];
  payments: Payment[];
  components: Component[];
  progressSteps: ProgressStep[];
  calendarEvents: CalendarEvent[];
  chats: Chat[];
  tags: Tag[];
  users: User[];
  unread: number; // Add unread property to Chat interface

  // Loading states
  loading: {
    clients: boolean;
    invoices: boolean;
    payments: boolean;
    components: boolean;
    progressSteps: boolean;
    calendarEvents: boolean;
    chats: boolean;
    tags: boolean;
    users: boolean;
  };

  // Actions
  fetchClients: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchComponents: () => Promise<void>;
  fetchProgressSteps: () => Promise<void>;
  fetchCalendarEvents: () => Promise<void>;
  fetchChats: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchUsers: () => Promise<void>;

  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: number, updates: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  getClientById: (id: number) => Client | undefined;

  addInvoice: (invoiceData: { clientId: number; packageName: string; amount: number; invoiceDate: string }) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (invoiceId: string) => void;
  getInvoicesByClientId: (clientId: number) => Invoice[];

  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentsByClientId: (clientId: number) => Payment[];

  addComponent: (component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addComponents: (components: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  getComponentsByClientId: (clientId: number) => Component[];
  getComponentsByInvoiceId: (invoiceId: string) => Component[];

  addProgressStep: (step: Omit<ProgressStep, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProgressStep: (id: string, updates: Partial<ProgressStep>) => void;
  deleteProgressStep: (id: string) => void;
  getProgressStepsByClientId: (clientId: number) => ProgressStep[];

  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  addTag: (tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTag: (id: string, updates: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  copyComponentsToProgressSteps: (clientId: number) => void;

  // Computed values
  getTotalSales: () => number;
  getTotalCollection: () => number;
  getTotalBalance: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  clients: [],
  invoices: [],
  payments: [],
  components: [],
  progressSteps: [],
  calendarEvents: [],
  chats: [],
  tags: [],
  users: [],

  loading: {
    clients: false,
    invoices: false,
    payments: false,
    components: false,
    progressSteps: false,
    calendarEvents: false,
    chats: false,
    tags: false,
    users: false,
  },

  // Actions
  fetchClients: async () => {
    set((state) => ({ loading: { ...state.loading, clients: true } }));
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        clients: data || [],
        loading: { ...state.loading, clients: false }
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      set((state) => ({ loading: { ...state.loading, clients: false } }));
    }
  },

  fetchInvoices: async () => {
    set((state) => ({ loading: { ...state.loading, invoices: true } }));
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        invoices: data || [],
        loading: { ...state.loading, invoices: false }
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      set((state) => ({ loading: { ...state.loading, invoices: false } }));
    }
  },

  fetchPayments: async () => {
    set((state) => ({ loading: { ...state.loading, payments: true } }));
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        payments: data || [],
        loading: { ...state.loading, payments: false }
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      set((state) => ({ loading: { ...state.loading, payments: false } }));
    }
  },

  fetchComponents: async () => {
    set((state) => ({ loading: { ...state.loading, components: true } }));
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        components: data || [],
        loading: { ...state.loading, components: false }
      }));
    } catch (error) {
      console.error('Error fetching components:', error);
      set((state) => ({ loading: { ...state.loading, components: false } }));
    }
  },

  fetchProgressSteps: async () => {
    set((state) => ({ loading: { ...state.loading, progressSteps: true } }));
    try {
      const { data, error } = await supabase
        .from('progress_steps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        progressSteps: data || [],
        loading: { ...state.loading, progressSteps: false }
      }));
    } catch (error) {
      console.error('Error fetching progress steps:', error);
      set((state) => ({ loading: { ...state.loading, progressSteps: false } }));
    }
  },

  fetchCalendarEvents: async () => {
    set((state) => ({ loading: { ...state.loading, calendarEvents: true } }));
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        calendarEvents: data || [],
        loading: { ...state.loading, calendarEvents: false }
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      set((state) => ({ loading: { ...state.loading, calendarEvents: false } }));
    }
  },

  fetchChats: async () => {
    set((state) => ({ loading: { ...state.loading, chats: true } }));
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (chatsError) throw chatsError;
      
      // Fetch messages for each chat
      const chatsWithMessages = await Promise.all(
        (chatsData || []).map(async (chat) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: true });
          
          if (messagesError) {
            console.error('Error fetching messages for chat:', chat.id, messagesError);
            return { ...chat, messages: [] };
          }
          
          return {
            ...chat,
            client: chat.client_name,
            unread: chat.unread_count,
            online: chat.online,
            lastMessage: chat.last_message,
            timestamp: chat.last_message_at ? new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            messages: messagesData || []
          };
        })
      );
      
      set((state) => ({ 
        chats: chatsWithMessages,
        loading: { ...state.loading, chats: false }
      }));
    } catch (error) {
      console.error('Error fetching chats:', error);
      set((state) => ({ loading: { ...state.loading, chats: false } }));
    }
  },

  fetchTags: async () => {
    set((state) => ({ loading: { ...state.loading, tags: true } }));
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      set((state) => ({ 
        tags: data || [],
        loading: { ...state.loading, tags: false }
      }));
    } catch (error) {
      console.error('Error fetching tags:', error);
      set((state) => ({ loading: { ...state.loading, tags: false } }));
    }
  },

  fetchUsers: async () => {
    set((state) => ({ loading: { ...state.loading, users: true } }));
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set((state) => ({ 
        users: data || [],
        loading: { ...state.loading, users: false }
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      set((state) => ({ loading: { ...state.loading, users: false } }));
    }
  },

  addClient: (clientData) => {
    const insertClient = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert([{
            name: clientData.name,
            business_name: clientData.businessName,
            email: clientData.email,
            phone: clientData.phone,
            status: clientData.status,
            package_name: clientData.packageName,
            tags: clientData.tags || [],
            total_sales: clientData.totalSales || 0,
            total_collection: clientData.totalCollection || 0,
            balance: clientData.balance || 0,
            last_activity: clientData.lastActivity,
            invoice_count: clientData.invoiceCount || 0,
            registered_at: clientData.registeredAt,
            company: clientData.company,
            address: clientData.address,
            notes: clientData.notes
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          clients: [...state.clients, data],
        }));
      } catch (error) {
        console.error('Error adding client:', error);
      }
    };
    insertClient();
  },

  updateClient: (id, updates) => {
    const updateClientInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .update({
            name: updates.name,
            business_name: updates.businessName,
            email: updates.email,
            phone: updates.phone,
            status: updates.status,
            package_name: updates.packageName,
            tags: updates.tags,
            company: updates.company,
            address: updates.address,
            notes: updates.notes
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? data : client
          ),
        }));
      } catch (error) {
        console.error('Error updating client:', error);
      }
    };
    updateClientInDB();
  },

  deleteClient: (id) => {
    const deleteClientFromDB = async () => {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
          invoices: state.invoices.filter((invoice) => invoice.clientId !== id),
          payments: state.payments.filter((payment) => payment.clientId !== id),
          components: state.components.filter((component) => component.clientId !== id),
          progressSteps: state.progressSteps.filter((step) => step.clientId !== id),
          calendarEvents: state.calendarEvents.filter((event) => event.clientId !== id),
          chats: state.chats.filter((chat) => chat.clientId !== id),
        }));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    };
    deleteClientFromDB();
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },

  addInvoice: (invoiceData) => {
    const insertInvoice = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .insert([{
            client_id: invoiceData.clientId,
            package_name: invoiceData.packageName,
            amount: invoiceData.amount,
            due: invoiceData.amount,
            created_at: invoiceData.invoiceDate
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        set((state) => ({
          invoices: [...state.invoices, data],
        }));
        
        // Auto-create tag if it doesn't exist
        const { data: existingTag } = await supabase
          .from('tags')
          .select('id')
          .eq('name', invoiceData.packageName)
          .single();
        
        if (!existingTag) {
          await supabase
            .from('tags')
            .insert([{
              name: invoiceData.packageName,
              color: '#3B82F6'
            }]);
        }
        
        // Auto-create progress step for the package
        await supabase
          .from('progress_steps')
          .insert([{
            client_id: invoiceData.clientId,
            title: `${invoiceData.packageName} - Package Setup`,
            description: `Complete the setup and delivery of ${invoiceData.packageName} package`,
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            important: true
          }]);
        
        // Refresh data
        get().fetchTags();
        get().fetchProgressSteps();
        
      } catch (error) {
        console.error('Error adding invoice:', error);
      }
    };
    insertInvoice();
  },

  updateInvoice: (id, updates) => {
    const updateInvoiceInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .update({
            package_name: updates.packageName,
            amount: updates.amount,
            created_at: updates.createdAt
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? data : invoice
          ),
        }));
      } catch (error) {
        console.error('Error updating invoice:', error);
      }
    };
    updateInvoiceInDB();
  },

  deleteInvoice: (invoiceId) => {
    const deleteInvoiceFromDB = async () => {
      try {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', invoiceId);
        
        if (error) throw error;
        
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
          components: state.components.filter((comp) => comp.invoiceId !== invoiceId),
        }));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    };
    deleteInvoiceFromDB();
  },

  getInvoicesByClientId: (clientId) => {
    return get().invoices.filter((invoice) => invoice.clientId === clientId);
  },

  addPayment: (paymentData) => {
    const insertPayment = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert([{
            client_id: paymentData.clientId,
            invoice_id: paymentData.invoiceId,
            amount: paymentData.amount,
            payment_source: paymentData.paymentSource,
            status: paymentData.status,
            paid_at: paymentData.paidAt,
            receipt_file_url: paymentData.receiptFileUrl
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          payments: [...state.payments, data],
        }));
      } catch (error) {
        console.error('Error adding payment:', error);
      }
    };
    insertPayment();
  },

  updatePayment: (id, updates) => {
    const updatePaymentInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .update({
            amount: updates.amount,
            payment_source: updates.paymentSource,
            status: updates.status,
            paid_at: updates.paidAt
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id ? data : payment
          ),
        }));
      } catch (error) {
        console.error('Error updating payment:', error);
      }
    };
    updatePaymentInDB();
  },

  deletePayment: (id) => {
    const deletePaymentFromDB = async () => {
      try {
        const { error } = await supabase
          .from('payments')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    };
    deletePaymentFromDB();
  },

  getPaymentsByClientId: (clientId) => {
    return get().payments.filter((payment) => payment.clientId === clientId);
  },

  addComponent: (componentData) => {
    const insertComponent = async () => {
      try {
        const { data, error } = await supabase
          .from('components')
          .insert([{
            client_id: componentData.clientId,
            name: componentData.name,
            price: componentData.price || 'RM 0',
            active: componentData.active !== undefined ? componentData.active : true,
            invoice_id: componentData.invoiceId
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        // Create corresponding progress step
        await supabase
          .from('progress_steps')
          .insert([{
            client_id: componentData.clientId,
            title: componentData.name,
            description: `Complete the ${componentData.name} component`,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            important: false
          }]);
        
        set((state) => ({
          components: [...state.components, data],
        }));
        
        // Refresh progress steps
        get().fetchProgressSteps();
      } catch (error) {
        console.error('Error adding component:', error);
      }
    };
    insertComponent();
  },

  addComponents: (componentsData) => {
    const insertComponents = async () => {
      try {
        const componentsToInsert = componentsData.map(componentData => ({
          client_id: componentData.clientId,
          name: componentData.name,
          price: componentData.price || 'RM 0',
          active: componentData.active !== undefined ? componentData.active : true,
          invoice_id: componentData.invoiceId
        }));
        
        const { data, error } = await supabase
          .from('components')
          .insert(componentsToInsert)
          .select();
        
        if (error) throw error;
        
        // Create corresponding progress steps
        const progressStepsToInsert = componentsData.map(componentData => ({
          client_id: componentData.clientId,
          title: componentData.name,
          description: `Complete the ${componentData.name} component`,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          important: false
        }));
        
        await supabase
          .from('progress_steps')
          .insert(progressStepsToInsert);
        
        set((state) => ({
          components: [...state.components, ...(data || [])],
        }));
        
        // Refresh progress steps
        get().fetchProgressSteps();
      } catch (error) {
        console.error('Error adding components:', error);
      }
    };
    insertComponents();
  },
  updateComponent: (id, updates) => {
    const updateComponentInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('components')
          .update({
            name: updates.name,
            price: updates.price,
            active: updates.active
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          components: state.components.map((component) =>
            component.id === id ? data : component
          ),
        }));
      } catch (error) {
        console.error('Error updating component:', error);
      }
    };
    updateComponentInDB();
  },

  deleteComponent: (id) => {
    const deleteComponentFromDB = async () => {
      try {
        const { error } = await supabase
          .from('components')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        set((state) => ({
          components: state.components.filter((component) => component.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    };
    deleteComponentFromDB();
  },

  getComponentsByClientId: (clientId) => {
    return get().components.filter((component) => component.clientId === clientId);
  },

  getComponentsByInvoiceId: (invoiceId) => {
    return get().components.filter((component) => component.invoiceId === invoiceId);
  },

  addProgressStep: (stepData) => {
    const insertProgressStep = async () => {
      try {
        const { data, error } = await supabase
          .from('progress_steps')
          .insert([{
            client_id: stepData.clientId,
            title: stepData.title,
            description: stepData.description,
            deadline: stepData.deadline,
            important: stepData.important,
            comments: stepData.comments || []
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          progressSteps: [...state.progressSteps, data],
        }));
      } catch (error) {
        console.error('Error adding progress step:', error);
      }
    };
    insertProgressStep();
  },

  updateProgressStep: (id, updates) => {
    const updateProgressStepInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('progress_steps')
          .update({
            title: updates.title,
            description: updates.description,
            deadline: updates.deadline,
            completed: updates.completed,
            completed_date: updates.completedDate,
            important: updates.important,
            comments: updates.comments
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          progressSteps: state.progressSteps.map((step) =>
            step.id === id ? data : step
          ),
        }));
      } catch (error) {
        console.error('Error updating progress step:', error);
      }
    };
    updateProgressStepInDB();
  },

  deleteProgressStep: (id) => {
    const deleteProgressStepFromDB = async () => {
      try {
        const { error } = await supabase
          .from('progress_steps')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        set((state) => ({
          progressSteps: state.progressSteps.filter((step) => step.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting progress step:', error);
      }
    };
    deleteProgressStepFromDB();
  },

  getProgressStepsByClientId: (clientId) => {
    return get().progressSteps.filter((step) => step.clientId === clientId);
  },

  addCalendarEvent: (eventData) => {
    const insertCalendarEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .insert([{
            client_id: eventData.clientId,
            title: eventData.title,
            start_date: eventData.startDate,
            end_date: eventData.endDate,
            start_time: eventData.startTime,
            end_time: eventData.endTime,
            description: eventData.description,
            type: eventData.type
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          calendarEvents: [...state.calendarEvents, data],
        }));
      } catch (error) {
        console.error('Error adding calendar event:', error);
      }
    };
    insertCalendarEvent();
  },

  updateCalendarEvent: (id, updates) => {
    const updateCalendarEventInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .update({
            title: updates.title,
            start_date: updates.startDate,
            end_date: updates.endDate,
            start_time: updates.startTime,
            end_time: updates.endTime,
            description: updates.description,
            type: updates.type
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          calendarEvents: state.calendarEvents.map((event) =>
            event.id === id ? data : event
          ),
        }));
      } catch (error) {
        console.error('Error updating calendar event:', error);
      }
    };
    updateCalendarEventInDB();
  },

  deleteCalendarEvent: (id) => {
    const deleteCalendarEventFromDB = async () => {
      try {
        const { error } = await supabase
          .from('calendar_events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((event) => event.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting calendar event:', error);
      }
    };
    deleteCalendarEventFromDB();
  },

  addTag: async (tagData) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: tagData.name,
          color: tagData.color
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        tags: [...state.tags, data],
      }));
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  },

  updateTag: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update({
          name: updates.name,
          color: updates.color
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        tags: state.tags.map((tag) =>
          tag.id === id ? data : tag
        ),
      }));
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  },

  deleteTag: async (id) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  },

  addUser: (userData) => {
    const insertUser = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([{
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            client_id: userData.clientId,
            permissions: userData.permissions
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          users: [...state.users, data],
        }));
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };
    insertUser();
  },

  updateUser: (id, updates) => {
    const updateUserInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            name: updates.name,
            email: updates.email,
            role: updates.role,
            status: updates.status,
            client_id: updates.clientId,
            permissions: updates.permissions
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? data : user
          ),
        }));
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };
    updateUserInDB();
  },

  deleteUser: (id) => {
    const deleteUserFromDB = async () => {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };
    deleteUserFromDB();
  },

  copyComponentsToProgressSteps: (clientId) => {
    const copyToProgressSteps = async () => {
      try {
        const state = get();
        const clientComponents = state.components.filter(comp => comp.clientId === clientId);
        const clientInvoices = state.invoices.filter(inv => inv.clientId === clientId);
        
        // Create progress steps for packages (from invoices)
        for (const invoice of clientInvoices) {
          const { data: existingStep } = await supabase
            .from('progress_steps')
            .select('id')
            .eq('client_id', clientId)
            .eq('title', `${invoice.packageName} - Package Setup`)
            .single();
          
          if (!existingStep) {
            await supabase
              .from('progress_steps')
              .insert([{
                client_id: clientId,
                title: `${invoice.packageName} - Package Setup`,
                description: `Complete the setup and delivery of ${invoice.packageName} package`,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                important: true
              }]);
          }
        }
        
        // Create progress steps for components
        for (const component of clientComponents) {
          const { data: existingStep } = await supabase
            .from('progress_steps')
            .select('id')
            .eq('client_id', clientId)
            .eq('title', component.name)
            .single();
          
          if (!existingStep) {
            await supabase
              .from('progress_steps')
              .insert([{
                client_id: clientId,
                title: component.name,
                description: `Complete the ${component.name} component`,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                important: false
              }]);
          }
        }
        
        // Refresh progress steps
        get().fetchProgressSteps();
      } catch (error) {
        console.error('Error copying components to progress steps:', error);
      }
    };
    copyToProgressSteps();
  },

  getTotalSales: () => {
    return get().clients.reduce((total, client) => total + client.totalSales, 0);
  },

  getTotalCollection: () => {
    return get().clients.reduce((total, client) => total + client.totalCollection, 0);
  },

  getTotalBalance: () => {
    return get().clients.reduce((total, client) => total + client.balance, 0);
  },
}));