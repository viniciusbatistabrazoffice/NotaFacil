import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrders1726425598000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create orders table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'client_name',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['awaiting_cutting', 'in_production', 'invoiced', 'finished', 'cancelled'],
            default: "'awaiting_cutting'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'delivery_date',
            type: 'date',
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
          new TableIndex({ columnNames: ['status'] }),
          new TableIndex({ columnNames: ['created_at'] }),
        ],
      }),
    );

    // Create order_items table
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'int',
          },
          {
            name: 'product_name',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
        ],
        indices: [
          new TableIndex({ columnNames: ['order_id'] }),
        ],
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const orderItemsTable = await queryRunner.getTable('order_items');
    const orderFk = orderItemsTable?.foreignKeys.find((fk) => fk.columnNames.includes('order_id'));

    if (orderFk) {
      await queryRunner.dropForeignKey('order_items', orderFk);
    }

    const ordersTable = await queryRunner.getTable('orders');
    const userFk = ordersTable?.foreignKeys.find((fk) => fk.columnNames.includes('created_by'));

    if (userFk) {
      await queryRunner.dropForeignKey('orders', userFk);
    }

    // Drop tables
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
  }
}
