import { FinancialTransaction, FinancialTransactionType } from '../entities/tenant/FinancialTransaction';
import { getFinancialTransactionRepository } from '../repositories/financial.repository';

interface MovementFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
}

interface DepositInput {
  amount: number;
  description?: string;
  paymentMethod?: string;
}

interface WithdrawalInput {
  amount: number;
  description?: string;
  paymentMethod?: string;
}

interface ReconciliationInput {
  expectedBalance: number;
  actualBalance: number;
  notes?: string;
}

export class CashService {
  async getBalance(tenantSchema: string): Promise<{ balance: number }> {
    const repository = getFinancialTransactionRepository(tenantSchema);
    
    const transactions = await repository.find({
      where: { status: 'COMPLETED' },
    });

    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === FinancialTransactionType.INCOME) {
        balance += transaction.amount;
      } else if (transaction.type === FinancialTransactionType.EXPENSE) {
        balance -= transaction.amount;
      }
    });

    return { balance };
  }

  async getMovements(tenantSchema: string, filters: MovementFilters): Promise<FinancialTransaction[]> {
    const repository = getFinancialTransactionRepository(tenantSchema);
    
    const query = repository.createQueryBuilder('transaction');

    if (filters.startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate: filters.endDate });
    }

    if (filters.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }

    return query.orderBy('transaction.createdAt', 'DESC').getMany();
  }

  async deposit(tenantSchema: string, data: DepositInput, userId: number): Promise<FinancialTransaction> {
    const repository = getFinancialTransactionRepository(tenantSchema);

    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const transaction = repository.create({
      type: FinancialTransactionType.INCOME,
      amount: data.amount,
      description: data.description || 'Depósito em caixa',
      category: 'CASH_DEPOSIT',
      status: 'COMPLETED',
      userId,
    });

    return repository.save(transaction);
  }

  async withdrawal(tenantSchema: string, data: WithdrawalInput, userId: number): Promise<FinancialTransaction> {
    const repository = getFinancialTransactionRepository(tenantSchema);

    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const transaction = repository.create({
      type: FinancialTransactionType.EXPENSE,
      amount: data.amount,
      description: data.description || 'Saque do caixa',
      category: 'CASH_WITHDRAWAL',
      status: 'COMPLETED',
      userId,
    });

    return repository.save(transaction);
  }

  async getReconciliation(tenantSchema: string): Promise<any> {
    const repository = getFinancialTransactionRepository(tenantSchema);
    
    const transactions = await repository.find({
      where: { status: 'COMPLETED' },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === FinancialTransactionType.INCOME) {
        totalIncome += transaction.amount;
      } else if (transaction.type === FinancialTransactionType.EXPENSE) {
        totalExpense += transaction.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  async createReconciliation(tenantSchema: string, data: ReconciliationInput, userId: number): Promise<any> {
    const repository = getFinancialTransactionRepository(tenantSchema);

    const reconciliation = {
      expectedBalance: data.expectedBalance,
      actualBalance: data.actualBalance,
      difference: data.actualBalance - data.expectedBalance,
      notes: data.notes,
      createdAt: new Date(),
      userId,
    };

    return reconciliation;
  }

  async getDailyReport(tenantSchema: string, date?: string): Promise<any> {
    const repository = getFinancialTransactionRepository(tenantSchema);
    
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await repository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .andWhere('transaction.status = :status', { status: 'COMPLETED' })
      .orderBy('transaction.createdAt', 'DESC')
      .getMany();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === FinancialTransactionType.INCOME) {
        totalIncome += transaction.amount;
      } else if (transaction.type === FinancialTransactionType.EXPENSE) {
        totalExpense += transaction.amount;
      }
    });

    return {
      date: targetDate.toISOString().split('T')[0],
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactions,
      transactionCount: transactions.length,
    };
  }
}
