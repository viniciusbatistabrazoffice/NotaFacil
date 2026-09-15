import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateFinancialTransactions1726425599000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'financial_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'category',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['income', 'expense'],
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'settled', 'cancelled'],
            default: "'pending'",
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'settled_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'order_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          new TableIndex({ columnNames: ['type'] }),
          new TableIndex({ columnNames: ['status'] }),
          new TableIndex({ columnNames: ['created_at'] }),
          new TableIndex({ columnNames: ['order_id'] }),
        ],
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'financial_transactions',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'financial_transactions',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('financial_transactions');
    const orderFk = table?.foreignKeys.find((fk) => fk.columnNames.includes('order_id'));
    const userFk = table?.foreignKeys.find((fk) => fk.columnNames.includes('created_by'));

    if (orderFk) {
      await queryRunner.dropForeignKey('financial_transactions', orderFk);
    }
    if (userFk) {
      await queryRunner.dropForeignKey('financial_transactions', userFk);
    }

    await queryRunner.dropTable('financial_transactions');
  }
}
