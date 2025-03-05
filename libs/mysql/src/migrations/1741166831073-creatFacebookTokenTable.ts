import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatFacebookTokenTable1741166831073
  implements MigrationInterface
{
  name = 'CreatFacebookTokenTable1741166831073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`facebook_member_token\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(255) NULL, \`name\` varchar(255) NULL, \`token\` varchar(500) NULL, \`expires_in\` int NULL, \`email\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`facebook_member_token\``);
  }
}
