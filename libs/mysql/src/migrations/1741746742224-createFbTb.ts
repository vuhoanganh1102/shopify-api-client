import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFbTb1741746742224 implements MigrationInterface {
  name = 'CreateFbTb1741746742224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`facebook_member_token\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` varchar(255) NULL, \`token\` varchar(500) NULL, \`expires_in\` int NULL, \`token_type\` varchar(255) NULL, \`email\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`facebook_member_token\``);
  }
}
