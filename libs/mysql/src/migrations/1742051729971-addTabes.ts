import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTabes1742051729971 implements MigrationInterface {
  name = 'AddTabes1742051729971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`sync_data_from_shopify_to_app\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`cursor\` varchar(500) NOT NULL, \`shop\` varchar(500) NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_4e99fc18c795824ffe1075dd79\` (\`shop\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` ADD UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` (\`shopify_user_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4e99fc18c795824ffe1075dd79\` ON \`sync_data_from_shopify_to_app\``,
    );
    await queryRunner.query(`DROP TABLE \`sync_data_from_shopify_to_app\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\` (\`shopify_user_id\`)`,
    );
  }
}
