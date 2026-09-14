import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPaymentMethodToFinancialTransaction1726425600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'financial_transactions',
      new TableColumn({
        name: 'payment_method',
        type: 'enum',
        enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check', 'other'],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('financial_transactions', 'payment_method');
  }
}
