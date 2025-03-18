import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTble1742278502225 implements MigrationInterface {
  name = 'AddTble1742278502225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`google_account_token\` (\`shop\` varchar(255) NOT NULL, \`id\` varchar(255) NULL, \`name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`picture\` longtext NULL, \`refresh_token\` longtext NULL, \`access_token\` longtext NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`shop\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` ADD UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` (\`shopify_user_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\``,
    );
    await queryRunner.query(`DROP TABLE \`google_account_token\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\` (\`shopify_user_id\`)`,
    );
  }
}
