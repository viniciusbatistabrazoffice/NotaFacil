import { apiRequest } from './api';

export async function fetchDashboardStats(token) {
  try {
    const [orders, productions, supplies, invoices] = await Promise.all([
      apiRequest('/orders', { token }),
      apiRequest('/productions', { token }),
      apiRequest('/supplies', { token }),
      apiRequest('/invoices', { token }),
    ]);

    // Calculate statistics
    const totalOrders = orders.length;
    const inProductionOrders = orders.filter((o) => o.status === 'in_production').length;
    const totalOrderValue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    const totalProductions = productions.length;
    const inProductionCount = productions.filter((p) => p.stage !== 'done').length;
    
    const totalInvoices = invoices.length;
    const issuedInvoices = invoices.filter((i) => i.status === 'issued').length;
    const totalInvoiceValue = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
    
    const lowStockSupplies = supplies.filter((s) => s.stock <= s.minStock);

    return {
      stats: [
        {
          icon: 'orders',
          accent: 'blue',
          label: 'Pedidos em aberto',
          value: totalOrders.toString(),
          detail: `${inProductionOrders} em produção`,
        },
        {
          icon: 'scissors',
          accent: 'purple',
          label: 'Ordens em produção',
          value: inProductionCount.toString(),
          detail: `${totalProductions} total`,
        },
        {
          icon: 'invoice',
          accent: 'amber',
          label: 'Notas emitidas',
          value: issuedInvoices.toString(),
          detail: `${totalInvoices} total`,
        },
        {
          icon: 'financial',
          accent: 'green',
          label: 'Faturamento',
          value: `R$ ${(totalInvoiceValue / 1000).toFixed(1)}k`,
          detail: `+${totalOrderValue > 0 ? Math.round((totalInvoiceValue / totalOrderValue) * 100) : 0}% de pedidos`,
        },
      ],
      recentOrders: orders.slice(0, 5).map((o) => ({
        id: `#${o.id}`,
        client: o.clientName,
        items: o.itemsCount || 0,
        total: o.total || 0,
        date: o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString('pt-BR') : '—',
        status: o.status,
      })),
      productionOrders: productions.slice(0, 4).map((p) => ({
        id: p.id,
        product: p.product,
        client: p.client,
        stage: p.stage,
        progress: p.progress,
      })),
      lowStockSupplies: lowStockSupplies.slice(0, 4).map((s) => ({
        name: s.name,
        qty: `${s.stock} ${s.unit}`,
      })),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
