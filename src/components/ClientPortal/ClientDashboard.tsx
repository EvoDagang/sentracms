import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MessageSquare, DollarSign, HelpCircle, Package, Eye, Clock, CheckCircle, AlertCircle, User, Phone, Mail, MapPin, ChevronLeft, ChevronRight, X, Send, Paperclip, Smile, Plus, Star, Zap, Video } from 'lucide-react';
import ClientProgressTracker from '../Clients/ClientProgressTracker';
import { useAppStore } from '../../store/AppStore';

interface ClientDashboardProps {
  user: any;
  onBack: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onBack }) => {
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [showPackageComponents, setShowPackageComponents] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showViewAppointments, setShowViewAppointments] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddOnServices, setShowAddOnServices] = useState(false);

  const { 
    clients, 
    getProgressStepsByClientId, 
    getComponentsByClientId,
    getInvoicesByClientId,
    getPaymentsByClientId,
    chats,
    calendarEvents,
    fetchClients,
    fetchProgressSteps,
    fetchComponents,
    fetchInvoices,
    fetchPayments,
    fetchChats,
    fetchCalendarEvents
  } = useAppStore();

  // Fetch data when component mounts to ensure sync with admin
  useEffect(() => {
    fetchClients();
    fetchProgressSteps();
    fetchComponents();
    fetchInvoices();
    fetchPayments();
    fetchChats();
    fetchCalendarEvents();
  }, [fetchClients, fetchProgressSteps, fetchComponents, fetchInvoices, fetchPayments, fetchChats, fetchCalendarEvents]);

  // Find the client data based on the user email or create demo client for demo users
  let client = clients.find(c => c.email === user.email);
  
  if (!client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Client data not found</h2>
          <p className="text-slate-600 mb-4">Unable to load client information</p>
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const progressSteps = getProgressStepsByClientId(client.id);
  const components = getComponentsByClientId(client.id);
  const invoices = getInvoicesByClientId(client.id);
  const payments = getPaymentsByClientId(client.id);
  const clientChat = chats.find(chat => chat.clientId === client.id);
  const clientEvents = calendarEvents.filter(event => event.clientId === client.id);

  // Calculate progress
  const completedSteps = progressSteps.filter(step => step.completed).length;
  const totalSteps = progressSteps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Calculate billing summary
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.reduce((sum, inv) => sum + inv.paid, 0);
  const dueAmount = invoices.reduce((sum, inv) => sum + inv.due, 0);

  // Get the actual package name from invoices if available
  const actualPackageName = invoices.length > 0 ? invoices[0].packageName : 'No Package Assigned';

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const addOnServices = [
    {
      id: 1,
      title: "MONTHLY SUBSCRIPTION SELEPAS 12 BULAN",
      price: "RM499",
      period: "Sebulan",
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      features: [
        "Software KuasaPLUS",
        "Contact Limit Unlimited Database", 
        "Team Member : Unlimited Login"
      ]
    },
    {
      id: 2,
      title: "MONTHLY VIP WHATSAPP PRIVATE SUPPORT",
      price: "RM1,499",
      period: "Sebulan",
      icon: <MessageSquare className="w-6 h-6 text-green-600" />,
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      features: [
        "Private Dedicated Technical Support (Group Whatsapp)",
        "Max. 10 Automation Per Month",
        "Max. 5 ZOOM Session Per Month (1 Hour Duration)"
      ]
    },
    {
      id: 3,
      title: "ONE TIME ZOOM IT & TECHNICAL SUPPORT",
      price: "RM99",
      period: "Per Session",
      icon: <Video className="w-6 h-6 text-blue-600" />,
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      features: [
        "ZOOM Session One Time (1 Hour Duration)"
      ]
    }
  ];

  // Show Progress Tracker
  if (showProgressTracker) {
    return (
      <ClientProgressTracker
        clientId={client.id.toString()}
        onBack={() => setShowProgressTracker(false)}
      />
    );
  }

  // Show Package Components
  if (showPackageComponents) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 lg:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPackageComponents(false)}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <Package className="w-6 h-6 text-orange-600" />
                  <span>Package Components</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <p className="text-slate-600 mb-2">Current Package:</p>
              <h2 className="text-2xl font-bold text-slate-900">{actualPackageName}</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">List of modules you have access to</h3>
              <div className="space-y-3">
                {components.map((component, index) => (
                  <div key={component.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-slate-600" />
                      <div>
                        <span className="font-medium text-slate-900">{component.name}</span>
                        <p className="text-sm text-slate-600">{component.price}</p>
                      </div>
                    </div>
                    {component.active && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
                {components.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>No components assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Billing
  if (showBilling) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 lg:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBilling(false)}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">My Billing</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-slate-700">Name: </span>
                <span className="text-slate-900">{client.name}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Email: </span>
                <span className="text-slate-900">{client.email}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Registered Package: </span>
                <span className="text-slate-900">{actualPackageName}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Check your invoices & payment status</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-slate-700">Total Invoiced: </span>
                <span className="text-slate-900">RM {totalAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Total Paid: </span>
                <span className="text-green-600">RM {paidAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Balance: </span>
                <span className="text-red-600">RM {dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Invoice & Payment History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Invoice & Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Package</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Paid</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Due</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="py-3 px-4 text-slate-900">{invoice.packageName}</td>
                      <td className="py-3 px-4 text-slate-900">RM {invoice.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-600">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-green-600">RM {invoice.paid.toLocaleString()}</td>
                      <td className="py-3 px-4 text-red-600">RM {invoice.due.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Payment Details */}
            {payments.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-900 mb-3">Payment Details</h4>
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-900">RM {payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-600">{payment.paymentSource} • {new Date(payment.paidAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Need help? Contact us
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show View Appointments
  if (showViewAppointments) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 lg:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowViewAppointments(false)}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <span>View Appointments</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Appointments</h3>
            {clientEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {clientEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="py-3 px-4 text-slate-900">{event.title}</td>
                        <td className="py-3 px-4 text-slate-600">{new Date(event.startDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-slate-600">{event.startTime} - {event.endTime}</td>
                        <td className="py-3 px-4 text-slate-600">{event.description || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {event.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>No appointments scheduled</p>
                <p className="text-sm">Contact support to schedule an appointment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show Add On Services Modal
  if (showAddOnServices) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add On Service</h2>
                <p className="text-sm text-slate-600">Choose additional services to enhance your experience</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddOnServices(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {addOnServices.map((service) => (
              <div key={service.id} className={`bg-gradient-to-r ${service.bgColor} rounded-xl p-6 border ${service.borderColor} hover:shadow-md transition-all duration-200`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {service.title}
                      </h3>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-2xl font-bold text-slate-900">{service.price}</span>
                        <span className="text-sm text-slate-600">{service.period}</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
                    Select
                  </button>
                </div>

                <div className="bg-white rounded-lg p-4 border border-white/50">
                  <h4 className="font-semibold text-slate-900 mb-3">Apa Yang Anda Akan Dapat :</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {index + 1}) {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-600">Need help choosing the right service?</p>
                <p className="text-xs text-slate-500">Contact our support team for personalized recommendations</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddOnServices(false)}
                  className="px-4 py-2 text-slate-700 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                Hai, {client.name} 👋
              </h1>
              <p className="text-slate-600 text-sm lg:text-base">Welcome to your client portal</p>
          </div>
          <button 
            onClick={onBack}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Progress Tracking */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowProgressTracker(true)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-sm text-slate-600 mb-3">View your onboarding journey</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{progressPercentage}% Complete</p>
            </div>
          </div>

          {/* Package Component */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowPackageComponents(true)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Package Components</h3>
              <p className="text-sm text-slate-600 mb-3">List of modules you have access to</p>
              <div className="text-lg font-bold text-green-600">{components.length}</div>
              <p className="text-xs text-slate-500">Active Components</p>
            </div>
          </div>

          {/* My Billing */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowBilling(true)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">My Billing</h3>
              <p className="text-sm text-slate-600 mb-3">Check your invoices & payment status</p>
              <div className="text-lg font-bold text-purple-600">RM {dueAmount.toLocaleString()}</div>
              <p className="text-xs text-slate-500">Outstanding</p>
            </div>
          </div>

          {/* View Appointments */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowViewAppointments(true)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">View Appointments</h3>
              <p className="text-sm text-slate-600 mb-3">View your scheduled appointments</p>
              <div className="flex items-center justify-center text-orange-600">
                <Eye className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">View Appointments</span>
              </div>
            </div>
          </div>
        </div>
          {/* Add On Service */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowAddOnServices(true)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Add On Service</h3>
              <p className="text-sm text-slate-600 mb-3">Explore additional services</p>
              <div className="flex items-center justify-center text-blue-600">
                <Plus className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Browse Services</span>
              </div>
            </div>
          </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Need Help */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600">Contact us for assistance</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Phone Support</p>
                  <p className="text-xs text-slate-600">+60 12-345 6789</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email Support</p>
                  <p className="text-xs text-slate-600">support@sentra.com</p>
                </div>
              </div>
              
              {clientChat && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Live Chat</p>
                    <p className="text-xs text-blue-700">
                      {clientChat.unread > 0 ? `${clientChat.unread} new messages` : 'No new messages'}
                    </p>
                  </div>
                  {clientChat.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{clientChat.unread}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>

          {/* Chat Messages Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-96">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  AT
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Ahmad Tech Solutions</h3>
                  <p className="text-sm text-slate-500">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {clientChat && clientChat.messages ? clientChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'client'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'client' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg max-w-xs">
                    <p className="text-sm">Hi! I want to check our project progress.</p>
                    <p className="text-xs text-slate-500 mt-1">10:15 AM</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                  <p className="text-sm">Hello! The project is going well. We've completed the design phase and are now moving to development.</p>
                  <p className="text-xs text-blue-100 mt-1">10:18 AM</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg max-w-xs">
                  <p className="text-sm">Great! Can you share some screenshots?</p>
                  <p className="text-xs text-slate-500 mt-1">10:20 AM</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                  <p className="text-sm">Sure! I'll send them shortly. The UI looks very clean and modern.</p>
                  <p className="text-xs text-blue-100 mt-1">10:22 AM</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg max-w-xs">
                  <p className="text-sm">Thank you for the project update</p>
                  <p className="text-xs text-slate-500 mt-1">10:30 AM</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded">
                    <Smile className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;