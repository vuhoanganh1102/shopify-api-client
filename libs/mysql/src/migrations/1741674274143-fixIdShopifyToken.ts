import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixIdShopifyToken1741674274143 implements MigrationInterface {
  name = 'FixIdShopifyToken1741674274143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shopify_member_token\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopify_member_token\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopify_member_token\` ADD \`id\` bigint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shopify_member_token\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopify_member_token\` ADD \`id\` bigint UNSIGNED NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopify_member_token\` ADD PRIMARY KEY (\`id\`)`,
    );
  }
}
