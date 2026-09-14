import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSalesAndSaleItems1726425601000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sales table
    await queryRunner.createTable(
      new Table({
        name: 'sales',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['open', 'completed', 'cancelled'],
            default: "'open'",
          },
          {
            name: 'payment_status',
            type: 'enum',
            enum: ['pending', 'partially_paid', 'paid'],
            default: "'pending'",
          },
          {
            name: 'client_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'client_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'amount_paid',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'change',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'notes',
            type: 'text',
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
          new TableIndex({ columnNames: ['payment_status'] }),
          new TableIndex({ columnNames: ['created_at'] }),
          new TableIndex({ columnNames: ['client_id'] }),
        ],
      }),
    );

    // Create sale_items table
    await queryRunner.createTable(
      new Table({
        name: 'sale_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sale_id',
            type: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'product_name',
            type: 'varchar',
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          {
            name: 'size',
            type: 'varchar',
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
          new TableIndex({ columnNames: ['sale_id'] }),
          new TableIndex({ columnNames: ['product_id'] }),
        ],
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'sales',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'sales',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'sale_items',
      new TableForeignKey({
        columnNames: ['sale_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sales',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sale_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const salesTable = await queryRunner.getTable('sales');
    const clientFk = salesTable?.foreignKeys.find((fk) => fk.columnNames.includes('client_id'));
    const userFk = salesTable?.foreignKeys.find((fk) => fk.columnNames.includes('created_by'));

    if (clientFk) {
      await queryRunner.dropForeignKey('sales', clientFk);
    }
    if (userFk) {
      await queryRunner.dropForeignKey('sales', userFk);
    }

    const saleItemsTable = await queryRunner.getTable('sale_items');
    const saleFk = saleItemsTable?.foreignKeys.find((fk) => fk.columnNames.includes('sale_id'));
    const productFk = saleItemsTable?.foreignKeys.find((fk) => fk.columnNames.includes('product_id'));

    if (saleFk) {
      await queryRunner.dropForeignKey('sale_items', saleFk);
    }
    if (productFk) {
      await queryRunner.dropForeignKey('sale_items', productFk);
    }

    // Drop tables
    await queryRunner.dropTable('sale_items');
    await queryRunner.dropTable('sales');
  }
}
